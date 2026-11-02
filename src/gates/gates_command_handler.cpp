#include "gates_command_handler.h"

void GatesCommandHandler::consume(std::string payload)
{
    GatesCommand command = mapCommand(payload);

    if (_target == GATES_COMMAND_TARGET_GATES) {
        _gates->gatesChange(command);
    } else {
        _gates->doorChange(command);
    }
}

GatesCommand GatesCommandHandler::mapCommand(std::string command)
{
    if (command == "open") {
        return GATES_COMMAND_OPEN;
    } else if (command == "close") {
        return GATES_COMMAND_CLOSE;
    } else {
        return GATES_COMMAND_STOP;
    }
}
