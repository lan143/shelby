#include <enum/device_class.h>
#include <log/log.h>

#include "defines.h"
#include "gates.h"

static constexpr uint64_t GATES_MOTION_RESYNC_TIMEOUT_US = 120000000ULL;
static constexpr uint64_t GATES_MOTION_HARD_RESYNC_US = 300000000ULL;
static constexpr uint64_t GATES_STATE_REFRESH_US = 60000000ULL;

static const char* commandPayload(GatesCommand command)
{
    switch (command) {
        case GATES_COMMAND_OPEN:
            return "open";
        case GATES_COMMAND_CLOSE:
            return "close";
        case GATES_COMMAND_STOP:
            return "stop";
    }

    return "stop";
}

void Gates::init(EDHA::Device* device, std::string topicPrefix)
{
    pinMode(GATE_OPEN, INPUT);
    pinMode(GATE_CLOSE, INPUT);

    char topic[256] = {0};

    snprintf(topic, sizeof(topic), "%s/gates/state", topicPrefix.c_str());
    _gatesStateTopic = topic;

    snprintf(topic, sizeof(topic), "%s/gates/set", topicPrefix.c_str());
    _gatesCommandTopic = topic;

    snprintf(topic, sizeof(topic), "%s/door/state", topicPrefix.c_str());
    _doorStateTopic = topic;

    snprintf(topic, sizeof(topic), "%s/door/set", topicPrefix.c_str());
    _doorCommandTopic = topic;

    _discoveryMgr->addCover(
        device,
        "Gates",
        "gates",
        "gates_cover_shelby"
    )
        ->setDeviceClass(EDHA::deviceClassCoverGate)
        ->setCommandTopic(_gatesCommandTopic)
        ->setStateTopic(_gatesStateTopic)
        ->setPayloadClose("close")
        ->setPayloadOpen("open")
        ->setPayloadStop("stop");

    _discoveryMgr->addCover(
        device,
        "Gates door mode",
        "gates_door_mode",
        "gates_door_mode_cover_shelby"
    )
        ->setDeviceClass(EDHA::deviceClassCoverDoor)
        ->setCommandTopic(_doorCommandTopic)
        ->setStateTopic(_doorStateTopic)
        ->setPayloadClose("close")
        ->setPayloadOpen("open")
        ->setPayloadStop("stop");
}

void Gates::gatesChange(GatesCommand command)
{
    if (_state != GATES_RELAY_STATE_IDLE) {
        LOGW("gates", "rejected gates %s: relay busy", commandPayload(command));
        return;
    }

    if (_doorState != GATES_STATE_CLOSED) {
        LOGW("gates", "rejected gates %s: door not closed", commandPayload(command));
        return;
    }

    if (skipCommand(_gatesState, command)) {
        LOGW("gates", "rejected gates %s: invalid from state %s", commandPayload(command), statePayload(_gatesState));
        return;
    }

    LOGI("gates", "accepted gates %s", commandPayload(command));

    _state = GATES_RELAY_STATE_GATE_ON;

    switch (command) {
        case GATES_COMMAND_OPEN:
            gatesStateUpdate(GATES_STATE_OPENING);
            break;
        case GATES_COMMAND_CLOSE:
            gatesStateUpdate(GATES_STATE_CLOSING);
            break;
        case GATES_COMMAND_STOP:
            gatesStateUpdate(GATES_STATE_OPENED);
            break;
    }
}

void Gates::doorChange(GatesCommand command)
{
    if (_state != GATES_RELAY_STATE_IDLE) {
        LOGW("gates", "rejected door %s: relay busy", commandPayload(command));
        return;
    }

    if (_gatesState != GATES_STATE_CLOSED) {
        LOGW("gates", "rejected door %s: gates not closed", commandPayload(command));
        return;
    }

    if (skipCommand(_doorState, command)) {
        LOGW("gates", "rejected door %s: invalid from state %s", commandPayload(command), statePayload(_doorState));
        return;
    }

    LOGI("gates", "accepted door %s", commandPayload(command));

    _state = GATES_RELAY_STATE_DOOR_ON;

    switch (command) {
        case GATES_COMMAND_OPEN:
            doorStateUpdate(GATES_STATE_OPENING);
            break;
        case GATES_COMMAND_CLOSE:
            doorStateUpdate(GATES_STATE_CLOSING);
            break;
        case GATES_COMMAND_STOP:
            doorStateUpdate(GATES_STATE_OPENED);
            break;
    }
}

void Gates::loop()
{
    if ((_lastRelayStateUpdateTime + 200000) < esp_timer_get_time()) { // every 0.2 second
        switch (_state) {
            case GATES_RELAY_STATE_GATE_ON:
                _gatesRelay->activate(true);
                _state = GATES_RELAY_STATE_GATE_OFF;
                break;
            case GATES_RELAY_STATE_GATE_OFF:
                _gatesRelay->activate(false);
                _state = GATES_RELAY_STATE_IDLE;
                break;
            case GATES_RELAY_STATE_DOOR_ON:
                _doorRelay->activate(true);
                _state = GATES_RELAY_STATE_DOOR_OFF;
                break;
            case GATES_RELAY_STATE_DOOR_OFF:
                _doorRelay->activate(false);
                _state = GATES_RELAY_STATE_IDLE;
                break;
        }

        _lastRelayStateUpdateTime = esp_timer_get_time();
    }

    if ((_lastMotorUpdateTime + 500000) < esp_timer_get_time()) { // every 0.5 second
        if (isMotorOpening()) {
            if (_gatesState == GATES_STATE_CLOSED
                && _doorState == GATES_STATE_CLOSED) {
                    gatesStateUpdate(GATES_STATE_OPENING);
            }

            _isMotorOpening = true;
        } else if (_isMotorOpening && isGatesOpen()) {
            if (_gatesState == GATES_STATE_OPENING) {
                gatesStateUpdate(GATES_STATE_OPENED);
            } else if (_doorState == GATES_STATE_OPENING) {
                doorStateUpdate(GATES_STATE_OPENED);
            }

            _isMotorOpening = false;
        } else if (isMotorClosing()) {
            if (_gatesState == GATES_STATE_OPENED) {
                gatesStateUpdate(GATES_STATE_CLOSING);
            } else if (_doorState == GATES_STATE_OPENED) {
                doorStateUpdate(GATES_STATE_CLOSING);
            }

            _isMotorClosing = true;
        } else if (_isMotorClosing && !isGatesOpen()) {
            gatesStateUpdate(GATES_STATE_CLOSED);
            doorStateUpdate(GATES_STATE_CLOSED);

            _isMotorClosing = false;
        }

        if (isMotorOpening() || isMotorClosing()) {
            _lastMotionTimeUs = esp_timer_get_time();
        }

        _lastMotorUpdateTime = esp_timer_get_time();

        uint64_t now = esp_timer_get_time();

        bool motionTimeoutReached = !isMotorOpening() && !isMotorClosing()
            && (now - _lastMotionTimeUs) >= GATES_MOTION_RESYNC_TIMEOUT_US;
        bool gatesHardCapReached = (_gatesState == GATES_STATE_OPENING || _gatesState == GATES_STATE_CLOSING)
            && _gatesMidMotionSinceUs != 0
            && (now - _gatesMidMotionSinceUs) >= GATES_MOTION_HARD_RESYNC_US;
        bool doorHardCapReached = (_doorState == GATES_STATE_OPENING || _doorState == GATES_STATE_CLOSING)
            && _doorMidMotionSinceUs != 0
            && (now - _doorMidMotionSinceUs) >= GATES_MOTION_HARD_RESYNC_US;

        if (motionTimeoutReached || gatesHardCapReached || doorHardCapReached) {
            bool gatesOpen = isGatesOpen();
            const char* resyncReason = (gatesHardCapReached || doorHardCapReached)
                ? "hard cap"
                : "motion timeout";

            GatesState gatesResolved = _gatesState;
            if (_gatesState == GATES_STATE_OPENING || _gatesState == GATES_STATE_CLOSING) {
                gatesResolved = gatesOpen ? GATES_STATE_OPENED : GATES_STATE_CLOSED;
            } else if (_gatesState == GATES_STATE_OPENED && !gatesOpen) {
                gatesResolved = GATES_STATE_CLOSED;
            }

            if (gatesResolved != _gatesState) {
                LOGW(
                    "gates",
                    "gates state resynced: %s -> %s (%s)",
                    statePayload(_gatesState),
                    statePayload(gatesResolved),
                    resyncReason
                );
                gatesStateUpdate(gatesResolved);
            }

            GatesState doorResolved = _doorState;
            if (_doorState == GATES_STATE_OPENING || _doorState == GATES_STATE_CLOSING) {
                doorResolved = gatesOpen ? GATES_STATE_OPENED : GATES_STATE_CLOSED;
            } else if (_doorState == GATES_STATE_OPENED && !gatesOpen) {
                doorResolved = GATES_STATE_CLOSED;
            }

            if (doorResolved != _doorState) {
                LOGW(
                    "gates",
                    "door state resynced: %s -> %s (%s)",
                    statePayload(_doorState),
                    statePayload(doorResolved),
                    resyncReason
                );
                doorStateUpdate(doorResolved);
            }
        }
    }

    if ((_lastUpdateMeasurementsTime + 1000) < esp_timer_get_time()) { // every 0.001 second
        _openMeasurements += digitalRead(GATE_OPEN) == 0 ? 1 : -1;
        _openMeasurements = constrain(_openMeasurements, 0, 50);

        _closeMeasurements += digitalRead(GATE_CLOSE) == 0 ? 1 : -1;
        _closeMeasurements = constrain(_closeMeasurements, 0, 50);

        _lastUpdateMeasurementsTime = esp_timer_get_time();
    }

    bool connected = _mqtt->isConnected();

    if (connected != _mqttWasConnected) {
        _forceStateRepublish = true;
        _mqttWasConnected = connected;
    }

    // Same cadence and change-only semantics the aggregate StateMgr provided,
    // but each cover publishes its own non-retained payload independently.
    if ((_lastStatePublishTime + 500000) < esp_timer_get_time()) { // every 0.5 second
        uint64_t now = esp_timer_get_time();
        bool periodicRefreshDue = connected
            && (now - _lastForcedRepublishUs) >= GATES_STATE_REFRESH_US;

        if (connected && (_forceStateRepublish || periodicRefreshDue)) {
            // MQTT has (re)connected or the periodic refresh is due: publish both
            // covers even when unchanged, and keep trying until both publishes succeed.
            bool gatesPublished = publishState(
                _gatesStateTopic,
                _gatesState,
                &_lastPublishedGatesState,
                true
            );
            bool doorPublished = publishState(
                _doorStateTopic,
                _doorState,
                &_lastPublishedDoorState,
                true
            );

            if (gatesPublished && doorPublished) {
                _forceStateRepublish = false;
                _lastForcedRepublishUs = esp_timer_get_time();
            }
        } else if (connected) {
            publishState(_gatesStateTopic, _gatesState, &_lastPublishedGatesState);
            publishState(_doorStateTopic, _doorState, &_lastPublishedDoorState);
        }

        _lastStatePublishTime = esp_timer_get_time();
    }
}

void Gates::gatesStateUpdate(GatesState newState)
{
    if (newState == GATES_STATE_OPENING || newState == GATES_STATE_CLOSING) {
        if (newState != _gatesState) {
            _gatesMidMotionSinceUs = esp_timer_get_time();
        }
    } else {
        _gatesMidMotionSinceUs = 0;
    }

    _gatesState = newState;
}

void Gates::doorStateUpdate(GatesState newState)
{
    if (newState == GATES_STATE_OPENING || newState == GATES_STATE_CLOSING) {
        if (newState != _doorState) {
            _doorMidMotionSinceUs = esp_timer_get_time();
        }
    } else {
        _doorMidMotionSinceUs = 0;
    }

    _doorState = newState;
}

bool Gates::skipCommand(GatesState state, GatesCommand command)
{
    switch (command) {
        case GATES_COMMAND_OPEN:
            return state != GATES_STATE_CLOSED;
        case GATES_COMMAND_CLOSE:
            return state != GATES_STATE_OPENED;
        case GATES_COMMAND_STOP:
            return state != GATES_STATE_OPENING && state != GATES_STATE_CLOSING;
    }

    return true;
}

bool Gates::isMotorOpening()
{
    return _openMeasurements > 25;
}

bool Gates::isMotorClosing()
{
    return _closeMeasurements > 25;
}

bool Gates::isGatesOpen()
{
    auto state = _gatesOpenSensor->isActive();

    // Until the MR6C answered, the value is unknown; treat it as closed exactly
    // like the old aggregate State did before its first reading.
    return state.second && state.first;
}

bool Gates::publishState(
    const std::string& topic,
    GatesState state,
    GatesState* lastPublishedState,
    bool force
)
{
    if (!force && state == *lastPublishedState) {
        return true;
    }

    if (_mqtt->publish(topic.c_str(), statePayload(state), false)) {
        *lastPublishedState = state;
        return true;
    }

    return false;
}

const char* Gates::statePayload(GatesState state)
{
    switch (state) {
        case GATES_STATE_CLOSED:
            return "closed";
        case GATES_STATE_OPENING:
            return "opening";
        case GATES_STATE_CLOSING:
            return "closing";
        case GATES_STATE_OPENED:
            return "open";
    }

    return "closed";
}
