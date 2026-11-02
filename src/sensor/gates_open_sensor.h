#pragma once

#include <binary_sensor/wb_mr6c.h>
#include <device/wb_mr6c.h>
#include <state/state_mgr.h>

#include "state/state.h"

// Gate-open binary sensor backed by EDCommon, with an adapter that keeps the
// aggregate State (and therefore the gates state machine) up to date.
class GatesOpenSensor : public EDCommon::BinarySensor::WBMR6C
{
public:
    GatesOpenSensor(EDUtils::StateMgr<State>* stateMgr, EDWB::MR6C* mr6c);

    void update();

private:
    EDUtils::StateMgr<State>* _stateMgr = NULL;
    std::pair<bool, bool> _lastForwardedState = {false, false};
};
