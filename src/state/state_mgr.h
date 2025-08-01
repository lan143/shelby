#pragma once

#include "state.h"
#include "producer.h"
#include "gates/gates_state.h"

class StateMgr
{
public:
    StateMgr(StateProducer* producer) : _producer(producer) {}

    void setGatesState(GatesState gatesState)
    {
        _gatesState = gatesState;
        publishState();
    }

    void setDoorState(GatesState doorState)
    {
        _doorState = doorState;
        publishState();
    }

    void setWateringLawnState(bool enabled)
    {
        _wateringLawnEnabled = enabled;
        publishState();
    }

    void setParkingLightState(bool enabled)
    {
        _parkingLightEnabled = enabled;
        publishState();
    }

    void setStreetLightState(bool enabled)
    {
        _streetLightEnabled = enabled;
        publishState();
    }

    void setSepticFillingLevel(float_t level)
    {
        _septicFillingLevel = level;
        publishState();
    }

    void setSepticFillingVolume(float_t volume)
    {
        _septicFillingVolume = volume;
        publishState();
    }

    void loop();

private:
    GatesState _gatesState = GATES_STATE_CLOSED;
    GatesState _doorState = GATES_STATE_CLOSED;
    bool _wateringLawnEnabled = false;
    bool _parkingLightEnabled = false;
    bool _streetLightEnabled = false;
    float_t _septicFillingLevel = 0.0f;
    float_t _septicFillingVolume = 0.0f;
    unsigned int _lastUpdateStateTime = 0;

private:
    State buildState();
    void publishState();

private:
    StateProducer* _producer;
};
