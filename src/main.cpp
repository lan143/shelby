#include <Arduino.h>
#include <ArduinoOTA.h>
#include <SPIFFS.h>
#include <ConfigMgr.h>
#include <esp_log.h>
#include <discovery.h>
#include <healthcheck.h>
#include <mqtt.h>
#include <wirenboard.h>

#include "defines.h"
#include "config.h"
#include "gates/gates.h"
#include "command/command_consumer.h"
#include "network/network.h"
#include "relay/relay.h"
#include "relay/wb_relay.h"
#include "sensor/qdy30a.h"
#include "state/producer.h"
#include "state/state_mgr.h"
#include "web/handler.h"

EDConfig::ConfigMgr<Config> configMgr(EEPROM_SIZE);
NetworkMgr networkMgr(configMgr.getConfig(), true);
EDHealthCheck::HealthCheck healthCheck;
EDMQTT::MQTT mqtt(configMgr.getConfig().mqtt);
EDHA::DiscoveryMgr discoveryMgr;
Relay gatesRelay;
Relay doorRelay;
StateProducer stateProducer(&mqtt);
StateMgr stateMgr(&stateProducer);
Gates gates(&gatesRelay, &doorRelay, &stateMgr, &discoveryMgr);
EDWB::WirenBoard modbus(Serial2);
WbRelay wbRelay(&discoveryMgr, &stateMgr, &modbus);
CommandConsumer commandConsumer(&gates, &wbRelay);
Handler handler(&configMgr, &networkMgr, &healthCheck, &modbus);
QDY30A qdy30a(modbus.getClient(), &discoveryMgr, &stateMgr);

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
        config.modbusSpeed = 9600;
        config.addressQDY30A = 1;
        config.addressMR6C = 2;
    });
    configMgr.load();

    Serial2.begin(configMgr.getConfig().modbusSpeed, SERIAL_8N1, RS485RX, RS485TX);
    modbus.init(15);

    networkMgr.init();

    ArduinoOTA.setPassword("somestrongpassword");
    ArduinoOTA.begin();

    commandConsumer.init(configMgr.getConfig().mqttCommandTopic);
    stateProducer.init(configMgr.getConfig().mqttStateTopic);

    mqtt.init();
    networkMgr.OnConnect([&](bool isConnected) {
        if (isConnected) {
            mqtt.connect();
        }
    });
    mqtt.subscribe(&commandConsumer);
    healthCheck.registerService(&mqtt);

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

    wbRelay.init(device, configMgr.getConfig().mqttCommandTopic, configMgr.getConfig().mqttStateTopic, configMgr.getConfig().addressMR6C);

    qdy30a.init(device, configMgr.getConfig().mqttStateTopic, configMgr.getConfig().addressQDY30A);

    ESP_LOGI("setup", "complete");
}

void loop()
{
    networkMgr.loop();
    discoveryMgr.loop();
    ArduinoOTA.handle();
    gates.loop();
    stateMgr.loop();
    healthCheck.loop();
    qdy30a.loop();
}
