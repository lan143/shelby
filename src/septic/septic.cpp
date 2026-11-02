#include <math.h>
#include <log/log.h>

#include "septic.h"

Septic::Septic(EDWB::QDY30A* qdy30a, float_t septicDiameter)
    : _qdy30a(qdy30a), _septicDiameter(septicDiameter), _waterLevel(qdy30a)
{
}

bool Septic::init(
    EDHA::DiscoveryMgr* discoveryMgr,
    EDHA::Device* device,
    EDMQTT::MQTT* mqtt,
    std::string topicPrefix
)
{
    bool isWaterLevelReady = _waterLevel.init(
        3,
        60000,
        {
            EDCommon::Sensor::withMQTT(mqtt, topicPrefix, "shelby", "Septic tank filling level"),
            EDCommon::Sensor::withDiscovery(discoveryMgr, device),
        }
    );

    if (!isWaterLevelReady) {
        LOGE("Septic", "failed to init water level sensor");
        return false;
    }

    if (_septicDiameter == 0.0f) {
        return true;
    }

    _volumeSensor = new SepticDerivedSensor(
        [this]() {
            return std::make_pair(_volume, _hasValidReading);
        },
        "m³",
        "volume_storage"
    );

    _absorptionSpeedSensor = new SepticDerivedSensor(
        [this]() {
            return std::make_pair(_absorptionSpeedValue, true);
        },
        "L/h",
        "volume_flow_rate"
    );

    _incomingSpeedSensor = new SepticDerivedSensor(
        [this]() {
            return std::make_pair(_incomingSpeedValue, true);
        },
        "L/h",
        "volume_flow_rate"
    );

    bool isVolumeReady = _volumeSensor->init(
        3,
        1000,
        {
            EDCommon::Sensor::withMQTT(mqtt, topicPrefix, "shelby", "Septic tank filling volume"),
            EDCommon::Sensor::withDiscovery(discoveryMgr, device),
        }
    );

    bool isAbsorptionSpeedReady = _absorptionSpeedSensor->init(
        2,
        1000,
        {
            EDCommon::Sensor::withMQTT(mqtt, topicPrefix, "shelby", "Septic tank average absorption speed"),
            EDCommon::Sensor::withDiscovery(discoveryMgr, device),
        }
    );

    bool isIncomingSpeedReady = _incomingSpeedSensor->init(
        2,
        1000,
        {
            EDCommon::Sensor::withMQTT(mqtt, topicPrefix, "shelby", "Septic tank average incoming speed"),
            EDCommon::Sensor::withDiscovery(discoveryMgr, device),
        }
    );

    return isVolumeReady && isAbsorptionSpeedReady && isIncomingSpeedReady;
}

void Septic::update()
{
    _waterLevel.update();

    uint64_t lastReadTime = _waterLevel.getLastReadTime();
    if (lastReadTime != _lastProcessedReadTime) {
        _lastProcessedReadTime = lastReadTime;

        if (_waterLevel.isLastReadValid()) {
            _lastCorrectSensorUpdateTime = esp_timer_get_time();

            auto value = _waterLevel.getValue();
            if (value.second) {
                processReading(value.first);
            }
        }
    }

    uint64_t currentTime = esp_timer_get_time();

    if ((_lastUpdateAbsorptionSpeedTime + 300000000) < currentTime) { // set to zero every 5 minutes
        updateAbsorptionSpeed(0);
    }

    if ((_lastUpdateIncomingSpeedTime + 300000000) < currentTime) { // set to zero every 5 minutes
        updateIncomingSpeed(0);
    }

    if (_volumeSensor != nullptr && _hasValidReading) {
        _volumeSensor->update();
    }

    if (_absorptionSpeedSensor != nullptr) {
        _absorptionSpeedSensor->update();
    }

    if (_incomingSpeedSensor != nullptr) {
        _incomingSpeedSensor->update();
    }
}

EDHealthCheck::ReadyResult Septic::ready()
{
    bool isCorrect = true;
    if ((_lastCorrectSensorUpdateTime + 600000000) < esp_timer_get_time()) {
        isCorrect = false;
    }

    return EDHealthCheck::ReadyResult(
        isCorrect,
        !isCorrect ? "failed to get correct data from QDY30A sensor" : ""
    );
}

void Septic::processReading(float_t level)
{
    if (_hasLevel && level == _lastLevel) {
        return;
    }

    _hasLevel = true;
    _lastLevel = level;

    if (_septicDiameter == 0.0f) {
        return;
    }

    float_t volume = M_PI * pow(_septicDiameter / 2, 2) * level;
    _volume = float_t(uint32_t(volume * 1000.0f)) / 1000.0f;
    _hasValidReading = true;

    LOGD("Septic", "calculate volume: %fm3", volume);

    calculateAbsorptionSpeed(level, volume);
    calculateIncomingSpeed(level, volume);
}

void Septic::calculateAbsorptionSpeed(float_t level, float_t volume)
{
    float_t absorptionSpeed = 0.0f;

    if (volume < _lastVolume && level < 2.8) { // todo: move constant from level check to config
        float_t dt = float_t(esp_timer_get_time() - _lastChangeTime) / 1000000.0f;
        float_t dv = _lastVolume - volume;
        absorptionSpeed = dv / dt;
        absorptionSpeed = absorptionSpeed * 1000 * 3600;
        updateAbsorptionSpeed(absorptionSpeed);

        LOGD("Septic", "calculate absorption speed. dt: %f, dv: %f, absorption speed: %f", dt, dv, absorptionSpeed);
    }

    _lastVolume = volume;
    _lastChangeTime = esp_timer_get_time();
}

void Septic::updateAbsorptionSpeed(float_t speed)
{
    _absorptionSpeed[_absorptionSpeedIdx] = speed;
    _absorptionSpeedIdx++;
    if (_absorptionSpeedIdx >= SEPTIC_DV_BUFFER_SIZE) {
        _absorptionSpeedIdx = 0;
    }

    float_t avgAbsorptionSpeed = 0.0f;
    for (uint8_t i = 0; i < SEPTIC_DV_BUFFER_SIZE; i++) {
        avgAbsorptionSpeed += _absorptionSpeed[i];
    }

    avgAbsorptionSpeed /= SEPTIC_DV_BUFFER_SIZE;
    avgAbsorptionSpeed = float_t(uint32_t(avgAbsorptionSpeed * 100.0f)) / 100.0f;

    _absorptionSpeedValue = avgAbsorptionSpeed;
    _lastUpdateAbsorptionSpeedTime = esp_timer_get_time();
}

void Septic::calculateIncomingSpeed(float_t level, float_t volume)
{
    float_t incomingSpeed = 0.0f;

    if (_lastIncomingVolume > 0.0f && volume > _lastIncomingVolume && level < 2.8) { // todo: move constant from level check to config
        float_t dt = float_t(esp_timer_get_time() - _lastIncomingChangeTime) / 1000000.0f;
        float_t dv = volume - _lastIncomingVolume;
        incomingSpeed = dv / dt;
        incomingSpeed = incomingSpeed * 1000 * 3600;
        updateIncomingSpeed(incomingSpeed);

        LOGD("Septic", "calculate incoming speed. dt: %f, dv: %f, incoming speed: %f", dt, dv, incomingSpeed);
    }

    _lastIncomingVolume = volume;
    _lastIncomingChangeTime = esp_timer_get_time();
}

void Septic::updateIncomingSpeed(float_t speed)
{
    _incomingSpeed[_incomingSpeedIdx] = speed;
    _incomingSpeedIdx++;
    if (_incomingSpeedIdx >= SEPTIC_DV_BUFFER_SIZE) {
        _incomingSpeedIdx = 0;
    }

    float_t avgIncomingSpeed = 0.0f;
    for (uint8_t i = 0; i < SEPTIC_DV_BUFFER_SIZE; i++) {
        avgIncomingSpeed += _incomingSpeed[i];
    }

    avgIncomingSpeed /= SEPTIC_DV_BUFFER_SIZE;
    avgIncomingSpeed = float_t(uint32_t(avgIncomingSpeed * 100.0f)) / 100.0f;

    _incomingSpeedValue = avgIncomingSpeed;
    _lastUpdateIncomingSpeedTime = esp_timer_get_time();
}
