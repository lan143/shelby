#include <Arduino.h>
#include <ArduinoOTA.h>
#include <SPIFFS.h>
#include <ConfigMgr.h>
#include <discovery.h>
#include <healthcheck.h>
#include <mqtt.h>
#include <wirenboard.h>
#include <state/state_mgr.h>
#include <network/network.h>
#include <log/log.h>

#include "defines.h"
#include "config.h"
#include "gates/gates.h"
#include "command/command_consumer.h"
#include "relay/relay.h"
#include "relay/wb_relay.h"
#include "sensor/binary_sensor.h"
#include "sensor/qdy30a.h"
#include "state/state.h"
#include "state/producer.h"
#include "web/handler.h"

EDConfig::ConfigMgr<Config> configMgr(EEPROM_SIZE);
EDNetwork::NetworkMgr networkMgr;
EDHealthCheck::HealthCheck healthCheck;
EDMQTT::MQTT mqtt;
EDHA::DiscoveryMgr discoveryMgr;
Relay gatesRelay;
Relay doorRelay;
StateProducer stateProducer(&mqtt);
EDUtils::StateMgr<State> stateMgr(&stateProducer);
Gates gates(&gatesRelay, &doorRelay, &stateMgr, &discoveryMgr);
EDWB::WirenBoard modbus(Serial2);
WbRelay* wbRelay;
CommandConsumer* commandConsumer;
Handler handler(&configMgr, &networkMgr, &healthCheck, &modbus);
BinarySensor* binarySensor;
QDY30A qdy30a(modbus.getClient(), &discoveryMgr, &stateMgr);

void setup()
{
    randomSeed(micros());

    Serial.begin(SERIAL_SPEED);

    esp_log_level_set("*", ESP_LOG_VERBOSE);

    LOGI("setup", "Shelby");
    LOGI("setup", "start");

    SPIFFS.begin(true);

    configMgr.setDefault([](Config* config) {
        snprintf(config->networkConfig.wifiAPSSID, WIFI_SSID_LEN, "Shelby_%s", EDUtils::getMacAddress().c_str());
        snprintf(config->mqttStateTopic, MQTT_TOPIC_LEN, "shelby/%s/state", EDUtils::getChipID());
        snprintf(config->mqttCommandTopic, MQTT_TOPIC_LEN, "shelby/%s/set", EDUtils::getChipID());
        snprintf(config->mqttHADiscoveryPrefix, MQTT_TOPIC_LEN, "homeassistant");
        config->modbusSpeed = 9600;
        config->addressQDY30A = 1;
        config->addressMR6C = 2;
        config->septicDiameter = 1.4f;
    });
    configMgr.load();

    // @todo: move to config
    EDUtils::LogConfig networkConfig;
    strcpy(networkConfig.host, "192.168.1.2");
    networkConfig.port = 5555;
    strcpy(networkConfig.uri, "/_bulk");

    networkLogger.init(networkConfig, deviceName, EDUtils::formatString("Shelby_%s", EDUtils::getMacAddress().c_str()));

    Serial2.begin(configMgr.getConfig()->modbusSpeed, SERIAL_8N1, RS485RX, RS485TX);
    modbus.init(15);

    networkMgr.init(configMgr.getConfig()->networkConfig, true, ETH_ADDR, -1, ETH_MDC_PIN, ETH_MDIO_PIN, ETH_TYPE, ETH_CLK_MODE);

    ArduinoOTA.setPassword("somestrongpassword");
    ArduinoOTA.begin();

    stateProducer.init(configMgr.getConfig()->mqttStateTopic);

    mqtt.init(configMgr.getConfig()->mqtt);
    networkMgr.OnConnect([&](bool isConnected) {
        networkLogger.enable(isConnected);

        if (isConnected) {
            mqtt.connect();
        } else {
            mqtt.disconnect();
        }
    });
    healthCheck.registerService(&mqtt);

    handler.init();

    discoveryMgr.init(
        configMgr.getConfig()->mqttHADiscoveryPrefix,
        configMgr.getConfig()->mqttIsHADiscovery,
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
    doorRelay.init(RELAY_DOOR, false);
    gates.init(device, configMgr.getConfig()->mqttStateTopic, configMgr.getConfig()->mqttCommandTopic);

    EDWB::MR6C* mr6c = modbus.addMR6C(configMgr.getConfig()->addressMR6C);
    wbRelay = new WbRelay(&discoveryMgr, &stateMgr, mr6c);
    wbRelay->init(device, configMgr.getConfig()->mqttCommandTopic, configMgr.getConfig()->mqttStateTopic);

    binarySensor = new BinarySensor(&discoveryMgr, &stateMgr, mr6c);
    binarySensor->init(device, configMgr.getConfig()->mqttStateTopic);

    commandConsumer = new CommandConsumer(&gates, wbRelay);
    commandConsumer->init(configMgr.getConfig()->mqttCommandTopic);
    mqtt.subscribe(commandConsumer);

    qdy30a.init(device, configMgr.getConfig()->mqttStateTopic, configMgr.getConfig()->addressQDY30A, configMgr.getConfig()->septicDiameter);
    healthCheck.registerService(&qdy30a);

    LOGI("setup", "complete");
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
    networkLogger.update();
    binarySensor->update();
}
