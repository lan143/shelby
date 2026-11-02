#pragma once

#include <Arduino.h>
#include <functional>
#include <sensor/sensor.h>

// EDCommon sensor whose value is provided by the septic orchestrator instead of
// a hardware backend.
class SepticDerivedSensor : public EDCommon::Sensor::Sensor
{
public:
    using Provider = std::function<std::pair<float_t, bool>()>;

    SepticDerivedSensor(
        Provider provider,
        std::string unitOfMeasurement,
        std::string deviceClass
    ) : _provider(provider),
        _unitOfMeasurement(unitOfMeasurement),
        _deviceClass(deviceClass) {}

protected:
    bool preInit() override
    {
        _config.unitOfMeasurement = _unitOfMeasurement;
        _config.deviceClass = _deviceClass;

        return true;
    }

    std::pair<float_t, bool> getValueInternal() override
    {
        return _provider();
    }

private:
    Provider _provider;
    std::string _unitOfMeasurement;
    std::string _deviceClass;
};
