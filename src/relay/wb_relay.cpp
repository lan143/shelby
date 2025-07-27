#include "wb_relay.h"

void WbRelay::init(EDHA::Device* device, std::string commandTopic, std::string stateTopic, uint8_t address)
{
    const char* chipID = EDUtils::getChipID();
    _mr6cDevice = _modbus->addMR6C(address);

    _discoveryMgr->addSwitch(
        device,
        "Watering the lawn",
        "wateringLawn",
        EDUtils::formatString("watering_lawn_relay_shelby_%s", chipID)
    )
        ->setCommandTemplate("{\"wateringLawnRelay\": {{ value }} }")
        ->setCommandTopic(commandTopic)
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.wateringLawnRelay }}")
        ->setPayloadOn("true")
        ->setPayloadOff("false")
        ->setStateOn("true")
        ->setStateOff("false");
}

void WbRelay::wateringLawnChangeState(bool enabled)
{
    _mr6cDevice->setRelayChannelState(1, enabled);
    _stateMgr->setWateringLawnState(enabled);
}
