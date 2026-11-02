#pragma once

#include <Arduino.h>
#include <device/qdy30a.h>
#include <sensor/water_level.h>

// EDCommon water-level sensor with the legacy 3.5 m sanity rejection and a
// record of the last poll attempt so the septic orchestrator can tell a fresh
// successful reading from a stale value.
class SepticWaterLevel : public EDCommon::Sensor::WaterLevel
{
public:
    SepticWaterLevel(EDWB::QDY30A* qdy30a) : EDCommon::Sensor::WaterLevel(qdy30a) {}

    uint64_t getLastReadTime() const { return _lastReadTime; }
    bool isLastReadValid() const { return _lastReadValid; }

protected:
    std::pair<float_t, bool> getValueInternal() override;

private:
    uint64_t _lastReadTime = 0;
    bool _lastReadValid = false;
};
