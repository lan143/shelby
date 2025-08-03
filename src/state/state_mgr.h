#pragma once

#include "state.h"
#include "producer.h"
#include "gates/gates_state.h"

class StateMgr
{
public:
    StateMgr(StateProducer* producer) : _producer(producer) {}

    State& getState() { return _newState; }
    void loop();

private:
    unsigned int _nextUpdateTime = 0;

    State _oldState;
    State _newState;

private:
    StateProducer* _producer;
};
