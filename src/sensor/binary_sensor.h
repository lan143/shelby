#pragma once

#include <discovery.h>
#include <wirenboard.h>
#include <device/wb_mr6c.h>
#include <state/state_mgr.h>

#include "state/state.h"

class BinarySensor
{
public:
    BinarySensor(
        EDHA::DiscoveryMgr* discoveryMgr,
        EDUtils::StateMgr<State>* stateMgr,
        EDWB::MR6C* mr6cDevice
    ) : _discoveryMgr(discoveryMgr), _stateMgr(stateMgr), _mr6cDevice(mr6cDevice) {}

    void init(EDHA::Device* device, std::string stateTopic);
    void update();

private:
    EDHA::DiscoveryMgr* _discoveryMgr = NULL;
    EDUtils::StateMgr<State>* _stateMgr = NULL;
    EDWB::MR6C* _mr6cDevice = NULL;

    uint64_t _lastUpdateTime = 0;
};
