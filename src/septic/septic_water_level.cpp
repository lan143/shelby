#include <log/log.h>

#include "septic_water_level.h"

std::pair<float_t, bool> SepticWaterLevel::getValueInternal()
{
    auto value = EDCommon::Sensor::WaterLevel::getValueInternal();

    if (value.second && value.first > 3.5f) {
        LOGE("Septic", "level more that 3.5m - %fm. Skip.", value.first);
        value = std::make_pair(0.0f, false);
    }

    _lastReadTime = esp_timer_get_time();
    _lastReadValid = value.second;

    return value;
}
