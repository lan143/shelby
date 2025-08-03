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

    void setWateringLawnState(bool enabled)
    {
        _isWateringLawnEnabled = enabled;
    }

    void setParkingLightState(bool enabled)
    {
        _isParkingLightEnabled = enabled;
    }

    void setStreetLightState(bool enabled)
    {
        _isStreetLightEnabled = enabled;
    }

    void setSepticFillingLevel(float_t level)
    {
        _septicFillingLevel = level;
    }

    float_t getSepticFillingLevel() const { return _septicFillingLevel; }

    void setSepticFillingVolume(float_t volume)
    {
        _septicFillingVolume = volume;
    }

    bool operator==(State& other);
    bool operator!=(State& other)
    {
        return !(*this == other);
    }

    std::string marshalJSON();

private:
    GatesState _gatesState = GATES_STATE_CLOSED;
    GatesState _doorState = GATES_STATE_CLOSED;
    bool _isWateringLawnEnabled = false;
    bool _isParkingLightEnabled = false;
    bool _isStreetLightEnabled = false;
    float_t _septicFillingLevel = 0.0f;
    float_t _septicFillingVolume = 0.0f;
};
