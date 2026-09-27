#pragma once

#include <discovery.h>
#include <wirenboard.h>
#include <device/wb_mr6c.h>
#include <state/state_mgr.h>

#include "state/state.h"

class WbRelay
{
public:
    WbRelay(
        EDHA::DiscoveryMgr* discoveryMgr,
        EDUtils::StateMgr<State>* stateMgr,
        EDWB::MR6C* mr6cDevice
    ) : _discoveryMgr(discoveryMgr), _stateMgr(stateMgr), _mr6cDevice(mr6cDevice) {}

    void init(EDHA::Device* device, std::string commandTopic, std::string stateTopic);
    void update();

    void wateringLawnChangeState(bool enabled);

    void parkingLightChangeState(bool enabled);
    void streetLightChangeState(bool enabled);
    void decorativeLightChangeState(bool enabled);

private:
    EDHA::DiscoveryMgr* _discoveryMgr = NULL;
    EDUtils::StateMgr<State>* _stateMgr = NULL;
    EDWB::MR6C* _mr6cDevice = NULL;

private:
    int64_t _lastWateringLawnEnableTime = 0;
    int64_t _lastCheckTime = 0;
};
