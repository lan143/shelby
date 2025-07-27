#pragma once

#include <iarduino_Modbus.h>
#include <discovery.h>

#include "state/state_mgr.h"

class QDY30A
{
public:
    QDY30A(ModbusClient* client, EDHA::DiscoveryMgr* discoveryMgr, StateMgr* stateMgr) : _client(client), _discoveryMgr(discoveryMgr), _stateMgr(stateMgr) {}
    void init(EDHA::Device* device, std::string stateTopic, uint8_t address);
    void loop();

private:
    ModbusClient* _client = NULL;
    EDHA::DiscoveryMgr* _discoveryMgr = NULL;
    StateMgr* _stateMgr = NULL;

    uint8_t _address = 0;
    int32_t _unitOfMeasurement = 0;
    int32_t _dotPosition = 0;

    uint64_t _lastUpdateTime = 0;
};
