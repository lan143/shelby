#include <enum/device_class.h>
#include "gates.h"

void Gates::init(EDHA::Device* device, std::string stateTopic, std::string commandTopic)
{
    _discoveryMgr->addCover(
        device,
        "Gates",
        "gates",
        "gates_cover_shelby"
    )
        ->setDeviceClass(EDHA::deviceClassCoverGate)
        ->setCommandTopic(commandTopic)
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.gates_state }}")
        ->setPayloadClose("{\"gates_payload\": \"close\"}")
        ->setPayloadOpen("{\"gates_payload\": \"open\"}")
        ->setPayloadStop("{\"gates_payload\": \"stop\"}");

        _discoveryMgr->addCover(
            device,
            "Gates door mode",
            "gates_door_mode",
            "gates_door_mode_cover_shelby"
        )
            ->setDeviceClass(EDHA::deviceClassCoverDoor)
            ->setCommandTopic(commandTopic)
            ->setStateTopic(stateTopic)
            ->setValueTemplate("{{ value_json.door_state }}")
            ->setPayloadClose("{\"door_payload\": \"close\"}")
            ->setPayloadOpen("{\"door_payload\": \"open\"}")
            ->setPayloadStop("{\"door_payload\": \"stop\"}");
}

void Gates::gatesChange(GatesCommand command)
{
    if (_state != GATES_RELAY_STATE_IDLE) {
        return;
    }

    if (_doorState != GATES_STATE_CLOSED) {
        return;
    }

    if (skipCommand(_gatesState, command)) {
        return;
    }

    _state = GATES_RELAY_STATE_GATE_ON;

    if (_gatesState != GATES_STATE_OPENING && _gatesState != GATES_STATE_CLOSING) {
        _stateChangeTime = millis() + 30000;
    }

    gatesStateUpdate();
}

void Gates::doorChange(GatesCommand command)
{
    if (_state != GATES_RELAY_STATE_IDLE) {
        return;
    }

    if (_gatesState != GATES_STATE_CLOSED) {
        return;
    }

    if (skipCommand(_doorState, command)) {
        return;
    }

    _state = GATES_RELAY_STATE_DOOR_ON;

    if (_doorState != GATES_STATE_OPENING && _doorState != GATES_STATE_CLOSING) {
        _stateChangeTime = millis() + 30000;
    }

    doorStateUpdate();
}

void Gates::loop()
{
    if (_lastRelayStateUpdateTime + 200 < millis()) {
        switch (_state) {
            case GATES_RELAY_STATE_GATE_ON:
                _gatesRelay->activate(true);
                _state = GATES_RELAY_STATE_GATE_OFF;
                break;
            case GATES_RELAY_STATE_GATE_OFF:
                _gatesRelay->activate(false);
                _state = GATES_RELAY_STATE_IDLE;
                break;
            case GATES_RELAY_STATE_DOOR_ON:
                _doorRelay->activate(true);
                _state = GATES_RELAY_STATE_DOOR_OFF;
                break;
            case GATES_RELAY_STATE_DOOR_OFF:
                _doorRelay->activate(false);
                _state = GATES_RELAY_STATE_IDLE;
                break;
        }

        _lastRelayStateUpdateTime = millis();
    }

    if (_stateChangeTime != 0 && _stateChangeTime < millis()) {
        if (_gatesState != GATES_STATE_CLOSED) {
            gatesStateUpdate();
        } else if (_doorState != GATES_STATE_CLOSED) {
            doorStateUpdate();
        }

        _stateChangeTime = 0;
    }
}

GatesState Gates::getUpdatedGatesState(GatesState oldState)
{
    switch (oldState) {
        case GATES_STATE_CLOSED:
            return GATES_STATE_OPENING;
        case GATES_STATE_OPENING:
            return GATES_STATE_OPENED;
        case GATES_STATE_OPENED:
            return GATES_STATE_CLOSING;
        case GATES_STATE_CLOSING:
            return GATES_STATE_CLOSED;
        default:
            return GATES_STATE_CLOSED;
    }
}

void Gates::gatesStateUpdate()
{
    _gatesState = getUpdatedGatesState(_gatesState);
    _stateMgr->setGatesState(_gatesState);
}

void Gates::doorStateUpdate()
{
    _doorState = getUpdatedGatesState(_doorState);
    _stateMgr->setDoorState(_doorState);
}

bool Gates::skipCommand(GatesState state, GatesCommand command)
{
    switch (command) {
        case GATES_COMMAND_OPEN:
            if (state == GATES_STATE_CLOSED) {
                return false;
            }
        case GATES_COMMAND_CLOSE:
            if (state == GATES_STATE_OPENED) {
                return false;
            }
        case GATES_COMMAND_STOP:
            if (state == GATES_STATE_OPENING || GATES_STATE_CLOSING) {
                return false;
            }
    }

    return true;
}
