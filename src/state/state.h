#pragma once

#include <Arduino.h>
#include "gates/gates_state.h"

class State
{
public:
    void setGatesState(GatesState gatesState)
    {
        _gatesState = gatesState;
    }

    void setDoorState(GatesState doorState)
    {
        _doorState = doorState;
    }

    bool operator==(State& other);
    bool operator!=(State& other)
    {
        return !(*this == other);
    }

    void changeGatesOpen(bool open) { _isGatesOpen = std::make_pair(open, true); }
    bool isGatesOpen() const { return _isGatesOpen.first; }

    std::string marshalJSON();

private:
    GatesState _gatesState = GATES_STATE_CLOSED;
    GatesState _doorState = GATES_STATE_CLOSED;
    std::pair<bool, bool> _isGatesOpen;
};
