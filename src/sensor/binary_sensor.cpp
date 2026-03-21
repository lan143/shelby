#include <log/log.h>
#include <Utils.h>

#include "binary_sensor.h"

void BinarySensor::init(EDHA::Device* device, std::string stateTopic)
{
    const char* chipID = EDUtils::getChipID();

    _mr6cDevice->setInputMode(1, EDWB::MR6C_INPUT_MODE_DONT_USE);

    _discoveryMgr->addBinarySensor(
        device,
        "Gates",
        "gates",
        EDUtils::formatString("gates_shelby_%s", chipID)
    )
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.isGatesOpen }}")
        ->setPayloadOn("true")
        ->setPayloadOff("false")
        ->setDeviceClass("garage_door");
}

void BinarySensor::update()
{
    if ((_lastUpdateTime + 500000) < esp_timer_get_time()) { // every 0.5 second
        auto isGatesClosed = _mr6cDevice->getInputChannelState(1);
        if (isGatesClosed.second) {
            _stateMgr->getState().changeGatesOpen(!isGatesClosed.first);
        } else {
            LOGE("update", "failed to get gates state");
        }

        _lastUpdateTime = esp_timer_get_time();
    }
}
