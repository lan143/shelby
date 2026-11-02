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
#include <relay/wb_mr6c.h>
#include <wirenboard.h>
#include <network/network.h>
#include <log/log.h>

#include "defines.h"
#include "config.h"
#include "gates/gates.h"
#include "gates/gates_command_handler.h"
#include "relay/relay.h"
#include "sensor/gates_open_sensor.h"
#include "septic/septic.h"
#include "web/handler.h"

EDConfig::DataMgr<Config> configMgr(new EDConfig::StorageEEPROM<Config>(EEPROM_SIZE));
EDNetwork::NetworkMgr networkMgr;
EDHealthCheck::HealthCheck healthCheck;
EDMQTT::MQTT mqtt;
EDHA::DiscoveryMgr discoveryMgr;
Relay gatesRelay;
Relay doorRelay;
Gates* gates;
EDWB::WirenBoard modbus(Serial2);
EDCommon::Relay::WBMR6C* lawnWateringRelay;
EDCommon::Relay::WBMR6C* decorativeRelay;
EDCommon::Relay::WBMR6C* parkingRelay;
EDCommon::Relay::WBMR6C* streetRelay;
GatesOpenSensor* gatesOpenSensor;
Septic* septic;
GatesCommandHandler* gatesCommandHandler;
GatesCommandHandler* doorCommandHandler;
Handler handler(&configMgr, &networkMgr, &healthCheck, &modbus);

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

    EDWB::MR6C* mr6c = modbus.addMR6C(configMgr.getData()->addressMR6C);

    // Input 1 is owned by the EDCommon binary sensor, which sets its own mode.
    const uint8_t frequencyInputs[] = {0, 2, 3, 4, 6};
    for (uint8_t input : frequencyInputs) {
        if (!mr6c->setInputMode(input, EDWB::MR6C_INPUT_MODE_FREQUENCY)) {
            LOGE("setup", "failed to set MR6C input %d to frequency mode", input);
        }
    }

    lawnWateringRelay = new EDCommon::Relay::WBMR6C(mr6c);
    lawnWateringRelay->init(1, -1, {
        EDCommon::Relay::withMQTT(&mqtt, configMgr.getData()->mqttTopicPrefix, "shelby", "Watering the lawn"),
        EDCommon::Relay::withDiscovery(&discoveryMgr, device),
        EDCommon::Relay::withTimeout(1200000000),
    });

    decorativeRelay = new EDCommon::Relay::WBMR6C(mr6c);
    decorativeRelay->init(4, -1, {
        EDCommon::Relay::withMQTT(&mqtt, configMgr.getData()->mqttTopicPrefix, "shelby", "Decorative light"),
        EDCommon::Relay::withDiscovery(&discoveryMgr, device),
    });

    parkingRelay = new EDCommon::Relay::WBMR6C(mr6c);
    parkingRelay->init(5, -1, {
        EDCommon::Relay::withMQTT(&mqtt, configMgr.getData()->mqttTopicPrefix, "shelby", "Parking space light"),
        EDCommon::Relay::withDiscovery(&discoveryMgr, device),
    });

    streetRelay = new EDCommon::Relay::WBMR6C(mr6c);
    streetRelay->init(6, -1, {
        EDCommon::Relay::withMQTT(&mqtt, configMgr.getData()->mqttTopicPrefix, "shelby", "Street light"),
        EDCommon::Relay::withDiscovery(&discoveryMgr, device),
    });

    gatesOpenSensor = new GatesOpenSensor(mr6c);
    gatesOpenSensor->init(500, {
        EDCommon::BinarySensor::withMQTT(&mqtt, configMgr.getData()->mqttTopicPrefix, "shelby", "Gates open"),
        EDCommon::BinarySensor::withDiscovery(&discoveryMgr, device),
    });

    gates = new Gates(&gatesRelay, &doorRelay, gatesOpenSensor, &mqtt, &discoveryMgr);
    gates->init(device, configMgr.getData()->mqttTopicPrefix);

    gatesCommandHandler = new GatesCommandHandler(gates, GATES_COMMAND_TARGET_GATES);
    gatesCommandHandler->init(gates->gatesCommandTopic().c_str());
    mqtt.subscribe(gatesCommandHandler);

    doorCommandHandler = new GatesCommandHandler(gates, GATES_COMMAND_TARGET_DOOR);
    doorCommandHandler->init(gates->doorCommandTopic().c_str());
    mqtt.subscribe(doorCommandHandler);

    septic = new Septic(
        modbus.addQDY30A(configMgr.getData()->addressQDY30A),
        configMgr.getData()->septicDiameter
    );
    septic->init(
        &discoveryMgr,
        device,
        &mqtt,
        configMgr.getData()->mqttTopicPrefix
    );
    healthCheck.registerService(septic);

    LOGI("setup", "complete");
}

void loop()
{
    networkMgr.loop();
    discoveryMgr.loop();
    ArduinoOTA.handle();
    gates->loop();
    healthCheck.loop();
    septic->update();
    networkLogger.update();
    gatesOpenSensor->update();
    lawnWateringRelay->update();
    decorativeRelay->update();
    parkingRelay->update();
    streetRelay->update();
}
