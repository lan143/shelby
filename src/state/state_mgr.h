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

private:
    GatesState _gatesState = GATES_STATE_CLOSED;
    GatesState _doorState = GATES_STATE_CLOSED;

private:
    State buildState();
    void publishState();

private:
    StateProducer* _producer;
};
