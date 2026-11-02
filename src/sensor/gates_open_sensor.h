#pragma once

#include <binary_sensor/wb_mr6c.h>
#include <device/wb_mr6c.h>

// Gate-open binary sensor backed by the MR6C input. It only supplies the
// garage_door device class; state publishing and validity tracking live in
// EDCommon::BinarySensor, and Gates reads it directly.
class GatesOpenSensor : public EDCommon::BinarySensor::WBMR6C
{
public:
    GatesOpenSensor(EDWB::MR6C* mr6c);
};
