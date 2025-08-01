#pragma once

#include <discovery.h>
#include <wirenboard.h>
#include <device/wb_mr6c.h>

#include "state/state_mgr.h"

class WbRelay
{
public:
    WbRelay(
        EDHA::DiscoveryMgr* discoveryMgr,
        StateMgr* stateMgr,
        EDWB::WirenBoard* modbus
    ) : _discoveryMgr(discoveryMgr), _stateMgr(stateMgr), _modbus(modbus) {}

    void init(EDHA::Device* device, std::string commandTopic, std::string stateTopic, uint8_t address);

    void wateringLawnChangeState(bool enabled);

    void parkingLightChangeState(bool enabled);
    void streetLightChangeState(bool enabled);

private:
    EDHA::DiscoveryMgr* _discoveryMgr = NULL;
    StateMgr* _stateMgr = NULL;
    EDWB::WirenBoard* _modbus = NULL;
    EDWB::MR6C* _mr6cDevice = NULL;
};
