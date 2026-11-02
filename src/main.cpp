#include <Arduino.h>
#include <ArduinoOTA.h>
#include <EEPROM.h>
#include <SPIFFS.h>
#include <crc16.hpp>
#include <cstring>
#include <data_mgr.h>
#include <storage/eeprom_storage.hpp>
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

EDConfig::DataMgr<Config> configMgr(new EDConfig::StorageEEPROM<Config>(EEPROM_SIZE));
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

// Validates the persisted v2 blob with the same CRC16 used by EDConfig::DataMgr.
static uint16_t calculateLegacyConfigChecksum(const ConfigLegacyV2* data)
{
    return EDConfig::crc16(
        EDConfig::CRC16_INIT,
        reinterpret_cast<const uint8_t*>(data),
        sizeof(ConfigLegacyV2)
    );
}

// Copies a fixed-size legacy char array into dst, always NUL-terminating and
// never reading more than dstSize - 1 source bytes. A CRC-valid blob can still
// contain a field without a terminator, so strcpy() here could read past the
// struct.
static void copyTerminatedString(char* dst, const char* src, size_t dstSize)
{
    size_t n = strnlen(src, dstSize - 1);
    memcpy(dst, src, n);
    dst[n] = '\0';
}

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
        snprintf(config->mqttTopicPrefix, MQTT_TOPIC_LEN, "shelby/%s", EDUtils::getChipID());
        snprintf(config->mqttHADiscoveryPrefix, MQTT_TOPIC_LEN, "homeassistant");
        config->modbusSpeed = 9600;
        config->addressQDY30A = 1;
        config->addressMR6C = 2;
        config->septicDiameter = 1.4f;
    });

    // One-time migration of the persisted EEPROM config blob from v2. The struct
    // layout changed (two topic fields became one prefix), so DataMgr::load()
    // would reject the old blob and silently reset every setting to defaults.
    // Read and validate the old blob first, then carry its fields forward after
    // the normal load; on any mismatch fall through to the unchanged flow.
    ConfigLegacyV2 legacy;
    bool haveLegacy = false;
    {
        EEPROM.begin(EEPROM_SIZE);
        EEPROM.get(0, legacy);

        uint16_t storedChecksum = 0;
        EEPROM.get(sizeof(ConfigLegacyV2), storedChecksum);
        EEPROM.end();

        if (storedChecksum == calculateLegacyConfigChecksum(&legacy) && legacy.version == 2) {
            haveLegacy = true;
            LOGI("setup", "found legacy v2 config");
        }
    }

    configMgr.load();

    if (haveLegacy) {
        Config* config = configMgr.getData();

        config->networkConfig = legacy.networkConfig;
        config->mqtt = legacy.mqtt;
        config->mqttIsHADiscovery = legacy.mqttIsHADiscovery;
        copyTerminatedString(config->mqttHADiscoveryPrefix, legacy.mqttHADiscoveryPrefix, sizeof(config->mqttHADiscoveryPrefix));

        // Preserve the established topics by deriving the prefix from the old
        // state topic; "shelby/<chipID>" is the safe fallback for malformed input.
        const char stateSuffix[] = "/state";
        size_t stateTopicLength = strnlen(legacy.stateTopic, sizeof(legacy.stateTopic));
        size_t suffixLength = sizeof(stateSuffix) - 1;
        if (
            stateTopicLength > suffixLength
            && strncmp(legacy.stateTopic + stateTopicLength - suffixLength, stateSuffix, suffixLength) == 0
        ) {
            size_t prefixLength = stateTopicLength - suffixLength;
            if (prefixLength >= sizeof(config->mqttTopicPrefix)) {
                prefixLength = sizeof(config->mqttTopicPrefix) - 1;
            }
            memcpy(config->mqttTopicPrefix, legacy.stateTopic, prefixLength);
            config->mqttTopicPrefix[prefixLength] = '\0';
        } else {
            snprintf(config->mqttTopicPrefix, MQTT_TOPIC_LEN, "shelby/%s", EDUtils::getChipID());
        }

        config->modbusSpeed = legacy.modbusSpeed;
        config->addressMR6C = legacy.addressMR6C;
        config->addressQDY30A = legacy.addressQDY30A;
        config->septicDiameter = legacy.septicDiameter;

        if (configMgr.store()) {
            LOGI("setup", "migrated config from legacy v2 layout");
        } else {
            LOGE("setup", "failed to store migrated config");
        }
    }

    // @todo: move to config
    EDUtils::LogConfig networkConfig;
    strcpy(networkConfig.host, "192.168.1.2");
    networkConfig.port = 5555;
    strcpy(networkConfig.uri, "/_bulk");

    networkLogger.init(networkConfig, deviceName, EDUtils::formatString("Shelby_%s", EDUtils::getMacAddress().c_str()));

    Serial2.begin(configMgr.getData()->modbusSpeed, SERIAL_8N1, RS485RX, RS485TX);
    modbus.init(15);

    networkMgr.init(configMgr.getData()->networkConfig, true, ETH_ADDR, -1, ETH_MDC_PIN, ETH_MDIO_PIN, ETH_TYPE, ETH_CLK_MODE);

    ArduinoOTA.setPassword("somestrongpassword");
    ArduinoOTA.begin();

    // The legacy modules still take full topics; keep their runtime strings
    // byte-identical to the pre-v3 values until later waves migrate them.
    char stateTopic[MQTT_TOPIC_LEN];
    char commandTopic[MQTT_TOPIC_LEN];
    snprintf(stateTopic, sizeof(stateTopic), "%s/state", configMgr.getData()->mqttTopicPrefix);
    snprintf(commandTopic, sizeof(commandTopic), "%s/set", configMgr.getData()->mqttTopicPrefix);

    stateProducer.init(stateTopic);

    mqtt.init(configMgr.getData()->mqtt);
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
        configMgr.getData()->mqttHADiscoveryPrefix,
        configMgr.getData()->mqttIsHADiscovery,
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
    gates.init(device, stateTopic, commandTopic);

    EDWB::MR6C* mr6c = modbus.addMR6C(configMgr.getData()->addressMR6C);
    wbRelay = new WbRelay(&discoveryMgr, &stateMgr, mr6c);
    wbRelay->init(device, commandTopic, stateTopic);

    binarySensor = new BinarySensor(&discoveryMgr, &stateMgr, mr6c);
    binarySensor->init(device, stateTopic);

    commandConsumer = new CommandConsumer(&gates, wbRelay);
    commandConsumer->init(commandTopic);
    mqtt.subscribe(commandConsumer);

    qdy30a.init(device, stateTopic, configMgr.getData()->addressQDY30A, configMgr.getData()->septicDiameter);
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
    wbRelay->update();
}
