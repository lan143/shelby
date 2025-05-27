#include <Arduino.h>
#include <ArduinoOTA.h>
#include <SPIFFS.h>
#include <ConfigMgr.h>
#include <esp_log.h>
#include <discovery.h>

#include "defines.h"
#include "config.h"
#include "command/command_consumer.h"
#include "gates/gates.h"
#include "mqtt/mqtt.h"
#include "network/network.h"
#include "relay/relay.h"
#include "state/producer.h"
#include "state/state_mgr.h"
#include "web/handler.h"

EDConfig::ConfigMgr<Config> configMgr(EEPROM_SIZE);
NetworkMgr networkMgr(configMgr.getConfig(), true);
EDMQTT::MQTT mqtt(configMgr.getConfig().mqtt, &networkMgr);
EDHA::DiscoveryMgr discoveryMgr;
Relay gatesRelay;
Relay doorRelay;
StateProducer stateProducer(&mqtt);
StateMgr stateMgr(&stateProducer);
Gates gates(&gatesRelay, &doorRelay, &stateMgr, &discoveryMgr);
CommandConsumer commandConsumer(&gates);
Handler handler(&configMgr, &networkMgr);

void setup()
{
    randomSeed(micros());

    Serial.begin(SERIAL_SPEED);

    ESP_LOGI("setup", "Shelby");
    ESP_LOGI("setup", "start");

    SPIFFS.begin(true);

    configMgr.setDefault([](Config& config) {
        snprintf(config.wifiAPSSID, WIFI_SSID_LEN, "Shelby_%s", EDUtils::getMacAddress().c_str());
        snprintf(config.mqttStateTopic, MQTT_TOPIC_LEN, "shelby/%s/state", EDUtils::getChipID());
        snprintf(config.mqttCommandTopic, MQTT_TOPIC_LEN, "shelby/%s/set", EDUtils::getChipID());
        snprintf(config.mqttHADiscoveryPrefix, MQTT_TOPIC_LEN, "homeassistant");
    });
    configMgr.load();

    networkMgr.init();

    ArduinoOTA.setPassword("somestrongpassword");
    ArduinoOTA.begin();

    commandConsumer.init(configMgr.getConfig().mqttCommandTopic);
    stateProducer.init(configMgr.getConfig().mqttStateTopic);

    mqtt.init();
    mqtt.subscribe(&commandConsumer);

    handler.init();

    discoveryMgr.init(
        configMgr.getConfig().mqttHADiscoveryPrefix,
        configMgr.getConfig().mqttIsHADiscovery,
        [](std::string topicName, std::string payload) {
            return mqtt.publish(topicName.c_str(), payload.c_str(), true);
        }
    );

    EDHA::Device* device = discoveryMgr.addDevice();
    device->setHWVersion(deviceHWVersion)
        ->setSWVersion(deviceFWVersion)
        ->setModel(deviceModel)
        ->setName(deviceName)
        ->setManufacturer(deviceManufacturer);

    gatesRelay.init(RELAY_GATE, false);
    doorRelay.init(RELAY_DRAWING, false);
    gates.init(device, configMgr.getConfig().mqttStateTopic, configMgr.getConfig().mqttCommandTopic);

    ESP_LOGI("setup", "complete");
}

void loop()
{
    mqtt.loop();
    networkMgr.loop();
    discoveryMgr.loop();
    ArduinoOTA.handle();
    gates.loop();
    stateMgr.loop();
}
