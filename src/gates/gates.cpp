#include <enum/device_class.h>
#include "defines.h"
#include "gates.h"

void Gates::init(EDHA::Device* device, std::string stateTopic, std::string commandTopic)
{
    pinMode(GATE_OPEN, INPUT);
    pinMode(GATE_CLOSE, INPUT);

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

    switch (command) {
        case GATES_COMMAND_OPEN:
            gatesStateUpdate(GATES_STATE_OPENING);
            break;
        case GATES_COMMAND_CLOSE:
            gatesStateUpdate(GATES_STATE_CLOSING);
            break;
        case GATES_COMMAND_STOP:
            gatesStateUpdate(GATES_STATE_OPENED);
            break;
    }
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

    switch (command) {
        case GATES_COMMAND_OPEN:
            doorStateUpdate(GATES_STATE_OPENING);
            break;
        case GATES_COMMAND_CLOSE:
            doorStateUpdate(GATES_STATE_CLOSING);
            break;
        case GATES_COMMAND_STOP:
            doorStateUpdate(GATES_STATE_OPENED);
            break;
    }
}

void Gates::loop()
{
    if ((_lastRelayStateUpdateTime + 200000) < esp_timer_get_time()) { // every 0.2 second
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

        _lastRelayStateUpdateTime = esp_timer_get_time();
    }

    if ((_lastMotorUpdateTime + 500000) < esp_timer_get_time()) { // every 0.5 second
        if (isMotorOpening()) {
            if (_gatesState == GATES_STATE_CLOSED
                && _doorState == GATES_STATE_CLOSED) {
                    gatesStateUpdate(GATES_STATE_OPENING);
            }

            _isMotorOpening = true;
        } else if (_isMotorOpening && _stateMgr->getState().isGatesOpen()) {
            if (_gatesState == GATES_STATE_OPENING) {
                gatesStateUpdate(GATES_STATE_OPENED);
            } else if (_doorState == GATES_STATE_OPENING) {
                doorStateUpdate(GATES_STATE_OPENED);
            }

            _isMotorOpening = false;
        }

        if (isMotorClosing()) {
            if (_gatesState == GATES_STATE_OPENED) {
                gatesStateUpdate(GATES_STATE_CLOSING);
            } else if (_doorState == GATES_STATE_OPENED) {
                doorStateUpdate(GATES_STATE_CLOSING);
            }

            _isMotorClosing = true;
        } else if (_isMotorClosing && !_stateMgr->getState().isGatesOpen()) {
            gatesStateUpdate(GATES_STATE_CLOSED);
            doorStateUpdate(GATES_STATE_CLOSED);

            _isMotorClosing = false;
        }

        _lastMotorUpdateTime = esp_timer_get_time();
    }
}

void Gates::gatesStateUpdate(GatesState newState)
{
    _gatesState = newState;
    _stateMgr->getState().setGatesState(_gatesState);
}

void Gates::doorStateUpdate(GatesState newState)
{
    _doorState = newState;
    _stateMgr->getState().setDoorState(_doorState);
}

bool Gates::skipCommand(GatesState state, GatesCommand command)
{
    switch (command) {
        case GATES_COMMAND_OPEN:
            return state != GATES_STATE_CLOSED;
        case GATES_COMMAND_CLOSE:
            return state != GATES_STATE_OPENED;
        case GATES_COMMAND_STOP:
            return state != GATES_STATE_OPENING && state != GATES_STATE_CLOSING;
    }

    return true;
}

bool Gates::isMotorOpening()
{
    return getPinState(GATE_OPEN) == 0;
}

bool Gates::isMotorClosing()
{
    return getPinState(GATE_CLOSE) == 0;
}

int Gates::getPinState(int pin)
{
    int measurements = 0;

    for (int i = 0; i < 10; i++) {
        measurements += digitalRead(pin);
        delayMicroseconds(10);
    }

    return measurements > 5 ? 1 : 0;
}
