#pragma once

#include <iarduino_Modbus.h>
#include <discovery.h>
#include <state/state_mgr.h>

#include "state/state.h"

class QDY30A
{
public:
    QDY30A(ModbusClient* client, EDHA::DiscoveryMgr* discoveryMgr, EDUtils::StateMgr<State>* stateMgr) : _client(client), _discoveryMgr(discoveryMgr), _stateMgr(stateMgr) {}
    void init(EDHA::Device* device, std::string stateTopic, uint8_t address, float_t septicDiameter);
    void loop();

private:
    void loadConstants();

private:
    ModbusClient* _client = NULL;
    EDHA::DiscoveryMgr* _discoveryMgr = NULL;
    EDUtils::StateMgr<State>* _stateMgr = NULL;

    uint8_t _address = 0;
    bool _isLoaded = false;
    int32_t _unitOfMeasurement = 0;
    int32_t _dotPosition = 0;
    float_t _septicDiameter = 0.0f;

    unsigned long _nextUpdateTime = 0;
};
