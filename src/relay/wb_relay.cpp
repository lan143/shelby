#include <Utils.h>
#include "wb_relay.h"

void WbRelay::init(EDHA::Device* device, std::string commandTopic, std::string stateTopic)
{
    const char* chipID = EDUtils::getChipID();

    _mr6cDevice->setInputMode(0, EDWB::MR6C_INPUT_MODE_FREQUENCY);
    _mr6cDevice->setInputMode(1, EDWB::MR6C_INPUT_MODE_FREQUENCY);
    _mr6cDevice->setInputMode(2, EDWB::MR6C_INPUT_MODE_FREQUENCY);
    _mr6cDevice->setInputMode(3, EDWB::MR6C_INPUT_MODE_FREQUENCY);
    _mr6cDevice->setInputMode(4, EDWB::MR6C_INPUT_MODE_FREQUENCY);
    _mr6cDevice->setInputMode(6, EDWB::MR6C_INPUT_MODE_FREQUENCY);

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

    _discoveryMgr->addSwitch(
        device,
        "Decorative light",
        "decorativeLight",
        EDUtils::formatString("decorative_light_relay_shelby_%s", chipID)
    )
        ->setCommandTemplate("{\"decorativeLight\": {{ value }} }")
        ->setCommandTopic(commandTopic)
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.decorativeLight }}")
        ->setPayloadOn("true")
        ->setPayloadOff("false")
        ->setStateOn("true")
        ->setStateOff("false");
}

void WbRelay::update()
{
    if (_stateMgr->getState().isWateringLawnEnabled() && (_lastWateringLawnEnableTime + 1200000000) < esp_timer_get_time()) {
        wateringLawnChangeState(false);
    }

    if ((_lastCheckTime + 1000000) < esp_timer_get_time()) {
        auto wateringLawnState = _mr6cDevice->getRelayChannelState(1);
        if (wateringLawnState.second && wateringLawnState.first != _stateMgr->getState().isWateringLawnEnabled()) {
            _mr6cDevice->setRelayChannelState(1, _stateMgr->getState().isWateringLawnEnabled());
        }

        _lastCheckTime = esp_timer_get_time();
    }
}

void WbRelay::wateringLawnChangeState(bool enabled)
{
    _mr6cDevice->setRelayChannelState(1, enabled);
    _stateMgr->getState().setWateringLawnState(enabled);

    if (enabled) {
        _lastWateringLawnEnableTime = esp_timer_get_time();
    }
}

void WbRelay::parkingLightChangeState(bool enabled)
{
    _mr6cDevice->setRelayChannelState(5, enabled);
    _stateMgr->getState().setParkingLightState(enabled);
}

void WbRelay::streetLightChangeState(bool enabled)
{
    _mr6cDevice->setRelayChannelState(6, enabled);
    _stateMgr->getState().setStreetLightState(enabled);
}

void WbRelay::decorativeLightChangeState(bool enabled)
{
    _mr6cDevice->setRelayChannelState(4, enabled);
    _stateMgr->getState().setDecorativeLightState(enabled);
}
