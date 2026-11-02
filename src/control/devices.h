#pragma once

#include <Arduino.h>
#include <relay/wb_mr6c.h>

class Gates;

// Plain data shared between the loopTask producers and the web handler
// (async_tcp consumer). The web task only reads these snapshots and enqueues
// commands through the existing control methods.
namespace Devices
{
    struct SensorValue
    {
        float_t value = 0;
        bool available = false;
    };

    struct CoverValue
    {
        int state = 0;
        bool available = true;
    };

    struct BinaryValue
    {
        bool value = false;
        bool available = false;
    };

    struct SwitchValue
    {
        bool enabled = false;
        bool available = false;
    };

    struct Snapshot
    {
        CoverValue gates;
        CoverValue door;
        BinaryValue gatesOpen;
        SwitchValue switches[4];
        SensorValue sensors[4];
    };

    struct Controls
    {
        Gates* gates = nullptr;
        EDCommon::Relay::Relay* switches[4] = {nullptr, nullptr, nullptr, nullptr};
    };

    extern Snapshot snapshot;
    extern Controls controls;

    // Reads every task-safe cached value (plus the loopTask-only relay
    // isEnabled() Modbus polls). Must only be called from loopTask.
    void updateSnapshot();
}
