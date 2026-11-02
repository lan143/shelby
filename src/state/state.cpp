#include <Json.h>
#include <ExtStrings.h>
#include "defines.h"
#include "state.h"

bool State::operator==(State& other)
{
    return (*this)._gatesState == other._gatesState
        && (*this)._doorState == other._doorState
        && (*this)._isGatesOpen == other._isGatesOpen;
}

std::string State::marshalJSON()
{
    std::string payload = EDUtils::buildJson([this](JsonObject entity) {
        switch (_gatesState) {
            case GATES_STATE_CLOSED:
                entity[F("gates_state")] = "closed";
                break;
            case GATES_STATE_OPENING:
                entity[F("gates_state")] = "opening";
                break;
            case GATES_STATE_CLOSING:
                entity[F("gates_state")] = "closing";
                break;
            case GATES_STATE_OPENED:
                entity[F("gates_state")] = "open";
                break;
        }

        switch (_doorState) {
            case GATES_STATE_CLOSED:
                entity[F("door_state")] = "closed";
                break;
            case GATES_STATE_OPENING:
                entity[F("door_state")] = "opening";
                break;
            case GATES_STATE_CLOSING:
                entity[F("door_state")] = "closing";
                break;
            case GATES_STATE_OPENED:
                entity[F("door_state")] = "open";
                break;
        }

        if (_isGatesOpen.second) {
            entity[F("isGatesOpen")] = _isGatesOpen.first ? "true" : "false";
        }
    });

    return payload;
}
