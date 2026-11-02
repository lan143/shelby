#include <discovery.h>

#include "gates_open_sensor.h"

const EDHA::DeviceClass deviceClassBinarySensorGarageDoor[] = "garage_door";

GatesOpenSensor::GatesOpenSensor(EDUtils::StateMgr<State>* stateMgr, EDWB::MR6C* mr6c)
    : EDCommon::BinarySensor::WBMR6C(1, deviceClassBinarySensorGarageDoor, true, mr6c),
      _stateMgr(stateMgr)
{
}

void GatesOpenSensor::update()
{
    EDCommon::BinarySensor::WBMR6C::update();

    auto currentState = isActive();

    // Only forward a reading once the MR6C answered and it changed. This is the
    // same contract as the old module: changeGatesOpen() is called only after a
    // successful read, and State's pair marks the value as valid.
    if (currentState.second && currentState != _lastForwardedState) {
        _stateMgr->getState().changeGatesOpen(currentState.first);
        _lastForwardedState = currentState;
    }
}
