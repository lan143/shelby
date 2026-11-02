#pragma once

#include <consumer.h>

#include "gates.h"

enum GatesCommandTarget : int
{
    GATES_COMMAND_TARGET_GATES,
    GATES_COMMAND_TARGET_DOOR
};

// One stateless consumer class instantiated per cover; each instance owns one
// command topic and forwards plain open/close/stop payloads to the gates state
// machine.
class GatesCommandHandler : public EDMQTT::Consumer
{
public:
    GatesCommandHandler(Gates* gates, GatesCommandTarget target) : _gates(gates), _target(target) {}

    void consume(std::string payload) override;

    // Commands must not be replayed from retained broker state on reconnect.
    bool acceptRetained() const override { return false; }

private:
    GatesCommand mapCommand(std::string command);

private:
    Gates* _gates;
    GatesCommandTarget _target;
};
