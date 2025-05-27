#pragma once

#include <discovery.h>
#include "gates_state.h"
#include "relay/relay.h"
#include "state/state_mgr.h"

enum GatesRelayState : int
{
    GATES_RELAY_STATE_IDLE,
    GATES_RELAY_STATE_GATE_ON,
    GATES_RELAY_STATE_GATE_OFF,
    GATES_RELAY_STATE_DOOR_ON,
    GATES_RELAY_STATE_DOOR_OFF
};

enum GatesCommand : int
{
    GATES_COMMAND_OPEN,
    GATES_COMMAND_CLOSE,
    GATES_COMMAND_STOP
};

class Gates
{
public:
    Gates(Relay* gatesRelay, Relay* doorRelay, StateMgr* stateMgr, EDHA::DiscoveryMgr* discoveryMgr) :
        _gatesRelay(gatesRelay), _doorRelay(doorRelay), _stateMgr(stateMgr), _discoveryMgr(discoveryMgr) {}

public:
    void init(EDHA::Device* device, std::string stateTopic, std::string commandTopic);

    void gatesChange(GatesCommand command);
    void doorChange(GatesCommand command);

    void loop();

private:
    void gatesStateUpdate(GatesState newState);
    void doorStateUpdate(GatesState newState);
    bool skipCommand(GatesState state, GatesCommand command);

    bool isMotorOpening();
    bool isMotorClosing();
    int getPinState(int pin);

private:
    Relay* _gatesRelay;
    Relay* _doorRelay;
    StateMgr* _stateMgr;
    EDHA::DiscoveryMgr* _discoveryMgr;

    GatesState _gatesState = GATES_STATE_CLOSED;
    GatesState _doorState = GATES_STATE_CLOSED;
    uint64_t _lastMotorUpdateTime = 0;
    bool _isMotorOpening = false;
    bool _isMotorClosing = false;

    GatesRelayState _state = GATES_RELAY_STATE_IDLE;
    uint64_t _lastRelayStateUpdateTime = 0;
};
