#include <Json.h>
#include <ExtStrings.h>
#include "defines.h"
#include "state.h"

bool State::operator==(State& other)
{
    return (*this)._gatesState == other._gatesState
        && (*this)._doorState == other._doorState
        && (*this)._isWateringLawnEnabled == other._isWateringLawnEnabled
        && (*this)._isParkingLightEnabled == other._isParkingLightEnabled
        && (*this)._isStreetLightEnabled == other._isStreetLightEnabled
        && (*this)._isDecorativeLightEnabled == other._isDecorativeLightEnabled
        && (*this)._septicFillingLevel == other._septicFillingLevel
        && (*this)._septicFillingVolume == other._septicFillingVolume
        && (*this)._septicAvgAbsorptionSpeed == other._septicAvgAbsorptionSpeed
        && (*this)._septicAvgIncomingSpeed == other._septicAvgIncomingSpeed;
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

        if (_isWateringLawnEnabled) {
            entity[F("wateringLawnRelay")] = "true";
        } else {
            entity[F("wateringLawnRelay")] = "false";
        }

        if (_isParkingLightEnabled) {
            entity[F("parkingLight")] = "true";
        } else {
            entity[F("parkingLight")] = "false";
        }
        
        if (_isStreetLightEnabled) {
            entity[F("streetLight")] = "true";
        } else {
            entity[F("streetLight")] = "false";
        }

        if (_isDecorativeLightEnabled) {
            entity[F("decorativeLight")] = "true";
        } else {
            entity[F("decorativeLight")] = "false";
        }

        if (_septicFillingLevel != 0.0f) {
            entity[F("septicFillingLevel")] = _septicFillingLevel;
        }

        if (_septicFillingVolume != 0.0f) {
            entity[F("septicFillingVolume")] = _septicFillingVolume;
        }

        entity[F("septicAvgAbsorptionSpeed")] = _septicAvgAbsorptionSpeed;
        entity[F("septicAvgIncomingSpeed")] = _septicAvgIncomingSpeed;
    });

    return payload;
}
