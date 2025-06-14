#include <ArduinoJson.h>
#include <Json.h>
#include <ExtStrings.h>
#include "defines.h"
#include "command.h"

bool Command::unmarshalJSON(const char* data)
{
    return EDUtils::parseJson(data, [this](JsonObject root) {
        if (root.containsKey(F("gates_payload"))) {
            _hasGatesPayload = true;
            _gatesPayload = root[F("gates_payload")].as<std::string>();
        }

        if (root.containsKey(F("door_payload"))) {
            _hasDoorPayload = true;
            _doorPayload = root[F("door_payload")].as<std::string>();
        }

        return true;
    });
}
