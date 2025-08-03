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

    _discoveryMgr->addSwitch(
        device,
        "Parking space light",
        "parkingLight",
        EDUtils::formatString("parking_space_relay_shelby_%s", chipID)
    )
        ->setCommandTemplate("{\"parkingLight\": {{ value }} }")
        ->setCommandTopic(commandTopic)
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.parkingLight }}")
        ->setPayloadOn("true")
        ->setPayloadOff("false")
        ->setStateOn("true")
        ->setStateOff("false");

    _discoveryMgr->addSwitch(
        device,
        "Street light",
        "streetLight",
        EDUtils::formatString("street_light_relay_shelby_%s", chipID)
    )
        ->setCommandTemplate("{\"streetLight\": {{ value }} }")
        ->setCommandTopic(commandTopic)
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.streetLight }}")
        ->setPayloadOn("true")
        ->setPayloadOff("false")
        ->setStateOn("true")
        ->setStateOff("false");
}

void WbRelay::wateringLawnChangeState(bool enabled)
{
    _mr6cDevice->setRelayChannelState(1, enabled);
    _stateMgr->getState().setWateringLawnState(enabled);
}

void WbRelay::parkingLightChangeState(bool enabled)
{
    _mr6cDevice->setRelayChannelState(4, enabled);
    _stateMgr->getState().setParkingLightState(enabled);
}

void WbRelay::streetLightChangeState(bool enabled)
{
    _mr6cDevice->setRelayChannelState(5, enabled);
    _stateMgr->getState().setStreetLightState(enabled);
}
