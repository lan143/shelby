#pragma once

#include <Arduino.h>
#include "mqtt/mqtt.h"
#include "mqtt/producer.h"
#include "state.h"

class StateProducer : public EDMQTT::Producer
{
public:
    StateProducer(EDMQTT::MQTT* mqtt) : EDMQTT::Producer(mqtt) {}

    void publish(State* state);
};
