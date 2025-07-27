#pragma once

#include <Arduino.h>
#include "gates/gates_state.h"

class State
{
public:
    State(
        GatesState gatesState,
        GatesState doorState,
        bool isWateringLawnEnabled,
        float_t septicFillingLevel
    ) : _gatesState(gatesState),
        _doorState(doorState),
        _isWateringLawnEnabled(isWateringLawnEnabled),
        _septicFillingLevel(septicFillingLevel) {}

    std::string marshalJSON();

private:
    GatesState _gatesState = GATES_STATE_CLOSED;
    GatesState _doorState = GATES_STATE_CLOSED;
    bool _isWateringLawnEnabled = false;
    float_t _septicFillingLevel = 0.0f;
};
