#pragma once

#include <Arduino.h>
#include "gates/gates_state.h"

class State
{
public:
    State(
        GatesState gatesState,
        GatesState doorState
    ) : _gatesState(gatesState),
        _doorState(doorState) {}

    std::string marshalJSON();

private:
    GatesState _gatesState = GATES_STATE_CLOSED;
    GatesState _doorState = GATES_STATE_CLOSED;
};
