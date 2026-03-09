#include <math.h>
#include <log/log.h>
#include <Utils.h>
#include "qdy30a.h"

void QDY30A::init(EDHA::Device* device, std::string stateTopic, uint8_t address, float_t septicDiameter)
{
    _address = address;
    _septicDiameter = septicDiameter;

    const char* chipID = EDUtils::getChipID();
    _discoveryMgr->addSensor(
        device,
        "Septic tank filling level",
        "septicFillingLevel",
        EDUtils::formatString("septic_filling_shelby_%s", chipID)
    )
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.septicFillingLevel }}")
        ->setUnitOfMeasurement("m");

    if (_septicDiameter != 0.0f) {
        _discoveryMgr->addSensor(
            device,
            "Septic tank filling volume",
            "septicFillingVolume",
            EDUtils::formatString("septic_filling_volume_shelby_%s", chipID)
        )
            ->setStateTopic(stateTopic)
            ->setValueTemplate("{{ value_json.septicFillingVolume }}")
            ->setUnitOfMeasurement("m³")
            ->setDeviceClass("volume_storage");

        _discoveryMgr->addSensor(
            device,
            "Septic tank average absorption speed",
            "septicAvgAbsorptionSpeed",
            EDUtils::formatString("septic_avg_absorption_speed_shelby_%s", chipID)
        )
            ->setStateTopic(stateTopic)
            ->setValueTemplate("{{ value_json.septicAvgAbsorptionSpeed }}")
            ->setUnitOfMeasurement("L/h")
            ->setDeviceClass("volume_flow_rate");

        _discoveryMgr->addSensor(
            device,
            "Septic tank average incoming speed",
            "septicAvgIncomingSpeed",
            EDUtils::formatString("septic_avg_incoming_speed_shelby_%s", chipID)
        )
            ->setStateTopic(stateTopic)
            ->setValueTemplate("{{ value_json.septicAvgIncomingSpeed }}")
            ->setUnitOfMeasurement("L/h")
            ->setDeviceClass("volume_flow_rate");
    }
}

void QDY30A::loop()
{
    uint64_t currentTime = esp_timer_get_time();

    if (_nextUpdateTime < currentTime) {
        if (!_isLoaded) {
            loadConstants();
        }

        if (!_isLoaded) {
            LOGE("QDY30A", "constants still not loaded. skip cycle.");
            _nextUpdateTime = currentTime + 1000000;
            return;
        }

        int32_t level = _client->holdingRegisterRead(_address, 0x0004);
        if (level == -1 || level == 0) {
            LOGE("QDY30A", "failed to get current level");
            _nextUpdateTime = currentTime + 5000000;
            return;
        }

        float_t convertLevel;

        switch (_dotPosition) {
            case 1:
                convertLevel = (float_t)level / 10.0f;
                break;
            case 2:
                convertLevel = (float_t)level / 100.0f;
                break;
            case 3:
                convertLevel = (float_t)level / 1000.0f;
                break;
        }

        switch (_unitOfMeasurement) {
            case 1:
            case 17:
                convertLevel /= 100.0f;
                break;
            case 2:
                convertLevel /= 1000.0f;
                break;
        }

        convertLevel = float_t(uint32_t(convertLevel*1000.0f))/1000.0f;
        if (convertLevel > 3.5f) {
            LOGE("QDY30A", "level more that 3.5m - %fm. Skip.", convertLevel);
            _nextUpdateTime = currentTime + 5000000;
            return;
        }

        LOGD("QDY30A", "current level: %fm", convertLevel);

        _lastCorrectSensorUpdateTime = esp_timer_get_time();

        if (_stateMgr->getState().getSepticFillingLevel() != convertLevel) {
            _stateMgr->getState().setSepticFillingLevel(float_t(uint32_t(convertLevel*1000.0f))/1000.0f);

            if (_septicDiameter != 0.0f) {
                float_t volume = M_PI * pow(_septicDiameter / 2, 2) * convertLevel;
                _stateMgr->getState().setSepticFillingVolume(float_t(uint32_t(volume*1000.0f))/1000.0f);
                LOGD("QDY30A", "calculate volume: %fm3", volume);

                calculateAbsorptionSpeed(convertLevel, volume);
                calculateIncomingSpeed(convertLevel, volume);
            }
        }

        _nextUpdateTime = currentTime + 60000000;
    }

    if ((_lastUpdateAbsorptionSpeedTime + 3600000000) < esp_timer_get_time()) { // set to zero every hour
        updateAbsorptionSpeed(0);
    }

    if ((_lastUpdateIncomingSpeedTime + 3600000000) < esp_timer_get_time()) { // set to zero every hour
        updateIncomingSpeed(0);
    }
}

void QDY30A::loadConstants()
{
    _unitOfMeasurement = _client->holdingRegisterRead(_address, 0x0002);
    _dotPosition = _client->holdingRegisterRead(_address, 0x0003);

    if (_unitOfMeasurement != -1 && _dotPosition != -1) {
        _isLoaded = true;
    }

    LOGD("QDY30A", "load constants: unitOfMeasurement: %d, dotPosition: %d", _unitOfMeasurement, _dotPosition);
}

void QDY30A::calculateAbsorptionSpeed(float_t level, float_t volume)
{
    float_t absorptionSpeed = 0.0f;

    if (volume < _lastVolume && level < 2.8) { // todo: move constant from level check to config
        float_t dt = float_t(esp_timer_get_time() - _lastChangeTime)/1000000.0f;
        float_t dv = _lastVolume - volume;
        absorptionSpeed = dv / dt;
        absorptionSpeed = absorptionSpeed * 1000 * 3600;
        updateAbsorptionSpeed(absorptionSpeed);

        LOGD("QDY30A", "calculate absorption speed. dt: %f, dv: %f, absorption speed: %f", dt, dv, absorptionSpeed);
    }

    _lastVolume = volume;
    _lastChangeTime = esp_timer_get_time();
}

void QDY30A::updateAbsorptionSpeed(float_t speed)
{
    _dspeed[_dspeedIdx] = speed;
    _dspeedIdx++;
    if (_dspeedIdx >= DV_BUFFER_SIZE) {
        _dspeedIdx = 0;    
    }
    
    float_t avgAbsorptionSpeed = 0.0f;
    for (uint8_t i = 0; i < DV_BUFFER_SIZE; i++) {
        avgAbsorptionSpeed += _dspeed[i];
    }

    avgAbsorptionSpeed /= DV_BUFFER_SIZE;
    avgAbsorptionSpeed = float_t(uint32_t(avgAbsorptionSpeed*100.0f))/100.0f;

    _stateMgr->getState().setSepticAvgAbsorptionSpeed(avgAbsorptionSpeed);
    _lastUpdateAbsorptionSpeedTime = esp_timer_get_time();
}

void QDY30A::calculateIncomingSpeed(float_t level, float_t volume)
{
    float_t incomingSpeed = 0.0f;

    if (_lastIncomingVolume > 0.0f && volume > _lastIncomingVolume && level < 2.8) { // todo: move constant from level check to config
        float_t dt = float_t(esp_timer_get_time() - _lastIncomingChangeTime)/1000000.0f;
        float_t dv = volume - _lastIncomingVolume;
        incomingSpeed = dv / dt;
        incomingSpeed = incomingSpeed * 1000 * 3600;
        updateIncomingSpeed(incomingSpeed);
    }

    _lastIncomingVolume = volume;
    _lastIncomingChangeTime = esp_timer_get_time();
}

void QDY30A::updateIncomingSpeed(float_t speed)
{
    _dIncomeSpeed[_dIncomeSpeedIdx] = speed;
    _dIncomeSpeedIdx++;
    if (_dIncomeSpeedIdx >= DV_BUFFER_SIZE) {
        _dIncomeSpeedIdx = 0;    
    }
    
    float_t avgIncomingSpeed = 0.0f;
    for (uint8_t i = 0; i < DV_BUFFER_SIZE; i++) {
        avgIncomingSpeed += _dIncomeSpeed[i];
    }

    avgIncomingSpeed /= DV_BUFFER_SIZE;
    avgIncomingSpeed = float_t(uint32_t(avgIncomingSpeed*100.0f))/100.0f;

    _stateMgr->getState().setSepticAvgIncomingSpeed(avgIncomingSpeed);
    _lastUpdateIncomingSpeedTime = esp_timer_get_time();
}
