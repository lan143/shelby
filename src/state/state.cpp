#include <Json.h>
#include <ExtStrings.h>
#include "defines.h"
#include "state.h"

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

        if (_isWateringLawnEnabled) {
            entity[F("wateringLawnRelay")] = "true";
        } else {
            entity[F("wateringLawnRelay")] = "false";
        }

        entity[F("septicFillingLevel")] = _septicFillingLevel;
    });

    return payload;
}
