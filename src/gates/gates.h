#pragma once

#include <binary_sensor/binary_sensor.h>
#include <discovery.h>
#include <mqtt.h>

#include "gates_state.h"
#include "relay/relay.h"

enum GatesRelayState : int
{
    GATES_RELAY_STATE_IDLE,
    GATES_RELAY_STATE_GATE_ON,
    GATES_RELAY_STATE_GATE_OFF,
    GATES_RELAY_STATE_DOOR_ON,
    GATES_RELAY_STATE_DOOR_OFF
};

enum GatesCommand : int
{
    GATES_COMMAND_OPEN,
    GATES_COMMAND_CLOSE,
    GATES_COMMAND_STOP
};

class Gates
{
public:
    Gates(
        Relay* gatesRelay,
        Relay* doorRelay,
        EDCommon::BinarySensor::BinarySensor* gatesOpenSensor,
        EDMQTT::MQTT* mqtt,
        EDHA::DiscoveryMgr* discoveryMgr
    ) :
        _gatesRelay(gatesRelay),
        _doorRelay(doorRelay),
        _gatesOpenSensor(gatesOpenSensor),
        _mqtt(mqtt),
        _discoveryMgr(discoveryMgr) {}

public:
    void init(EDHA::Device* device, std::string topicPrefix);

    void gatesChange(GatesCommand command);
    void doorChange(GatesCommand command);

    void loop();

    const std::string& gatesCommandTopic() const { return _gatesCommandTopic; }
    const std::string& doorCommandTopic() const { return _doorCommandTopic; }

    GatesState gatesState() const { return _gatesState; }
    GatesState doorState() const { return _doorState; }

private:
    void gatesStateUpdate(GatesState newState);
    void doorStateUpdate(GatesState newState);
    bool skipCommand(GatesState state, GatesCommand command);

    bool isMotorOpening();
    bool isMotorClosing();
    bool isGatesOpen();

    void publishState(const std::string& topic, GatesState state, GatesState* lastPublishedState);
    static const char* statePayload(GatesState state);

private:
    Relay* _gatesRelay;
    Relay* _doorRelay;
    EDCommon::BinarySensor::BinarySensor* _gatesOpenSensor;
    EDMQTT::MQTT* _mqtt;
    EDHA::DiscoveryMgr* _discoveryMgr;

    std::string _gatesStateTopic;
    std::string _gatesCommandTopic;
    std::string _doorStateTopic;
    std::string _doorCommandTopic;

    GatesState _gatesState = GATES_STATE_CLOSED;
    GatesState _doorState = GATES_STATE_CLOSED;
    GatesState _lastPublishedGatesState = GATES_STATE_CLOSED;
    GatesState _lastPublishedDoorState = GATES_STATE_CLOSED;
    uint64_t _lastStatePublishTime = 0;
    uint64_t _lastMotorUpdateTime = 0;
    bool _isMotorOpening = false;
    bool _isMotorClosing = false;
    int8_t _openMeasurements = 0;
    int8_t _closeMeasurements = 0;
    uint64_t _lastUpdateMeasurementsTime = 0;

    GatesRelayState _state = GATES_RELAY_STATE_IDLE;
    uint64_t _lastRelayStateUpdateTime = 0;
};
