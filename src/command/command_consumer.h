#pragma once

#include <Arduino.h>
#include "gates/gates.h"
#include "mqtt/consumer.h"

class CommandConsumer : public EDMQTT::Consumer
{
public:
    CommandConsumer(Gates* gates) : _gates(gates) {}
    void consume(std::string payload);

private:
    GatesCommand mapCommand(std::string command);

private:
    Gates* _gates;
};
