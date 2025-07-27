#include <Arduino.h>
#include <esp_log.h>
#include "command_consumer.h"
#include "command.h"

void CommandConsumer::consume(std::string payload)
{
    ESP_LOGD("command_consumer", "handle");

    Command command;
    if (!command.unmarshalJSON(payload.c_str())) {
        ESP_LOGE("command_consumer", "cant unmarshal command");
        return;
    }

    if (command.hasGatesPayload()) {
        _gates->gatesChange(mapCommand(command.getGatesPayload()));
    }

    if (command.hasDoorPayload()) {
        _gates->doorChange(mapCommand(command.getDoorPayload()));
    }

    if (command.hasWateringLawn()) {
        _wbRelay->wateringLawnChangeState(command.isEnabledWateringLawn());
    }
}

GatesCommand CommandConsumer::mapCommand(std::string command)
{
    if (command == "open") {
        return GATES_COMMAND_OPEN;
    } else if (command == "close") {
        return GATES_COMMAND_CLOSE;
    } else {
        return GATES_COMMAND_STOP;
    }
}