#pragma once

#include <iarduino_Modbus.h>
#include <discovery.h>
#include <state/state_mgr.h>

#include "state/state.h"

#define DV_BUFFER_SIZE 10

class QDY30A
{
public:
    QDY30A(ModbusClient* client, EDHA::DiscoveryMgr* discoveryMgr, EDUtils::StateMgr<State>* stateMgr) : _client(client), _discoveryMgr(discoveryMgr), _stateMgr(stateMgr) {}
    void init(EDHA::Device* device, std::string stateTopic, uint8_t address, float_t septicDiameter);
    void loop();

private:
    void loadConstants();
    void calculateAbsorptionSpeed(float_t level, float_t volume);
    void calculateIncomingSpeed(float_t level, float_t volume);

private:
    ModbusClient* _client = NULL;
    EDHA::DiscoveryMgr* _discoveryMgr = NULL;
    EDUtils::StateMgr<State>* _stateMgr = NULL;

    uint8_t _address = 0;
    bool _isLoaded = false;
    int32_t _unitOfMeasurement = 0;
    int32_t _dotPosition = 0;
    float_t _septicDiameter = 0.0f;

    float_t _lastVolume = 0.0f;
    float_t _dspeed[DV_BUFFER_SIZE] = {0};
    uint8_t _dspeedIdx= 0;
    unsigned long _lastChangeTime = 0;
    unsigned long _lastUpdateAbsorptionSpeedTime = 0;

    float_t _lastIncomingVolume = 0.0f;
    float_t _dIncomeSpeed[DV_BUFFER_SIZE] = {0};
    uint8_t _dIncomeSpeedIdx= 0;
    unsigned long _lastIncomingChangeTime = 0;
    unsigned long _lastUpdateIncomingSpeedTime = 0;

    unsigned long _nextUpdateTime = 0;
};
