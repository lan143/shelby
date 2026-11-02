#pragma once

#include <Arduino.h>
#include <device/qdy30a.h>
#include <discovery.h>
#include <mqtt.h>
#include <ready.h>

#include "septic_derived_sensor.h"
#include "septic_water_level.h"

#define SEPTIC_DV_BUFFER_SIZE 10

// Owns the QDY-30A level sensor and the derived septic values. The per-entity
// EDCommon sensors publish their own topics; this class keeps the legacy
// calculation invariants and feeds the health check.
class Septic : public EDHealthCheck::Ready
{
public:
    Septic(EDWB::QDY30A* qdy30a, float_t septicDiameter);

    bool init(
        EDHA::DiscoveryMgr* discoveryMgr,
        EDHA::Device* device,
        EDMQTT::MQTT* mqtt,
        std::string topicPrefix
    );

    void update();
    EDHealthCheck::ReadyResult ready() override;

private:
    void processReading(float_t level);
    void calculateAbsorptionSpeed(float_t level, float_t volume);
    void updateAbsorptionSpeed(float_t speed);
    void calculateIncomingSpeed(float_t level, float_t volume);
    void updateIncomingSpeed(float_t speed);

private:
    EDWB::QDY30A* _qdy30a = nullptr;
    float_t _septicDiameter = 0.0f;

    SepticWaterLevel _waterLevel;

    SepticDerivedSensor* _volumeSensor = nullptr;
    SepticDerivedSensor* _absorptionSpeedSensor = nullptr;
    SepticDerivedSensor* _incomingSpeedSensor = nullptr;

    uint64_t _lastProcessedReadTime = 0;
    uint64_t _lastCorrectSensorUpdateTime = 0;

    bool _hasLevel = false;
    float_t _lastLevel = 0.0f;
    bool _hasValidReading = false;
    float_t _volume = 0.0f;

    float_t _lastVolume = 0.0f;
    float_t _absorptionSpeed[SEPTIC_DV_BUFFER_SIZE] = {0};
    uint8_t _absorptionSpeedIdx = 0;
    uint64_t _lastChangeTime = 0;
    uint64_t _lastUpdateAbsorptionSpeedTime = 0;
    float_t _absorptionSpeedValue = 0.0f;

    float_t _lastIncomingVolume = 0.0f;
    float_t _incomingSpeed[SEPTIC_DV_BUFFER_SIZE] = {0};
    uint8_t _incomingSpeedIdx = 0;
    uint64_t _lastIncomingChangeTime = 0;
    uint64_t _lastUpdateIncomingSpeedTime = 0;
    float_t _incomingSpeedValue = 0.0f;
};
