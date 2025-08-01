#include <math.h>
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
        ->setUnitOfMeasurement("m")
        ->setDeviceClass("precipitation");

    if (_septicDiameter != 0.0f) {
        _discoveryMgr->addSensor(
            device,
            "Septic tank filling volume",
            "septicFillingVolume",
            EDUtils::formatString("septic_filling_volume_shelby_%s", chipID)
        )
            ->setStateTopic(stateTopic)
            ->setValueTemplate("{{ value_json.septicFillingVolume }}")
            ->setUnitOfMeasurement("m3")
            ->setDeviceClass("precipitation");
    }
}

void QDY30A::loop()
{
    unsigned long currentTime = millis();

    if (_nextUpdateTime < currentTime) {
        if (!_isLoaded) {
            loadConstants();
        }

        if (!_isLoaded) {
            _nextUpdateTime = currentTime + 1000;
            return;
        }

        int32_t level = _client->holdingRegisterRead(_address, 0x0004);
        if (level == -1 || level == 0) {
            _nextUpdateTime = currentTime + 5000;
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

        _stateMgr->setSepticFillingLevel(float_t(uint32_t(convertLevel*1000.0f))/1000.0f);
        if (_septicDiameter != 0.0f) {
            float_t volume = M_PI * pow(_septicDiameter / 2, 2) * convertLevel;
            _stateMgr->setSepticFillingVolume(float_t(uint32_t(volume*1000.0f))/1000.0f);
        }

        _nextUpdateTime = currentTime + 60000;
    }
}

void QDY30A::loadConstants()
{
    _unitOfMeasurement = _client->holdingRegisterRead(_address, 0x0002);
    _dotPosition = _client->holdingRegisterRead(_address, 0x0003);

    if (_unitOfMeasurement != -1 && _dotPosition != -1) {
        _isLoaded = true;
    }
}
