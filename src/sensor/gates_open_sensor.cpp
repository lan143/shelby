#include <discovery.h>

#include "gates_open_sensor.h"

const EDHA::DeviceClass deviceClassBinarySensorGarageDoor[] = "garage_door";

GatesOpenSensor::GatesOpenSensor(EDWB::MR6C* mr6c)
    : EDCommon::BinarySensor::WBMR6C(1, deviceClassBinarySensorGarageDoor, true, mr6c)
{
}
