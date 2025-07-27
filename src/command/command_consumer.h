#pragma once

#include <Arduino.h>
#include <consumer.h>

#include "gates/gates.h"
#include "relay/wb_relay.h"

class CommandConsumer : public EDMQTT::Consumer
{
public:
    CommandConsumer(Gates* gates, WbRelay* wbRelay) : _gates(gates), _wbRelay(wbRelay) {}
    void consume(std::string payload);

private:
    GatesCommand mapCommand(std::string command);

private:
    Gates* _gates;
    WbRelay* _wbRelay;
};
