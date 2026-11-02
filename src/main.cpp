#include <Arduino.h>
#include <ArduinoOTA.h>
#include <EEPROM.h>
#include <LittleFS.h>
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
#include <network/network_api.h>
#include <log/log.h>

#include "defines.h"
#include "config.h"
#include "control/devices.h"
#include "gates/gates.h"
#include "gates/gates_command_handler.h"
#include "relay/relay.h"
#include "sensor/gates_open_sensor.h"
#include "septic/septic.h"
#include "web/handler.h"

EDConfig::DataMgr<Config> configMgr(new EDConfig::StorageEEPROM<Config>(EEPROM_SIZE));
EDNetwork::NetworkMgr networkMgr;
EDNetwork::NetworkApi networkApi(networkMgr);
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
Handler handler(&configMgr, &networkMgr, &networkApi, &healthCheck, &modbus);

namespace Devices
{
    Snapshot snapshot;
    Controls controls;

    void updateSnapshot()
    {
        if (gates != nullptr) {
            snapshot.gates.state = (int)gates->gatesState();
            snapshot.gates.available = true;
            snapshot.door.state = (int)gates->doorState();
            snapshot.door.available = true;
        }

        if (gatesOpenSensor != nullptr) {
            auto active = gatesOpenSensor->isActive();
            snapshot.gatesOpen.value = active.first;
            snapshot.gatesOpen.available = active.second;
        }

        const size_t switchCount = sizeof(controls.switches) / sizeof(controls.switches[0]);
        for (size_t i = 0; i < switchCount; i++) {
            if (controls.switches[i] == nullptr) {
                snapshot.switches[i].enabled = false;
                snapshot.switches[i].available = false;
                continue;
            }

            auto enabled = controls.switches[i]->isEnabled();
            snapshot.switches[i].enabled = enabled.first;
            snapshot.switches[i].available = enabled.second;
        }

        if (septic != nullptr) {
            auto level = septic->getLevel();
            snapshot.sensors[0].value = level.first;
            snapshot.sensors[0].available = level.second;

            auto volume = septic->getVolume();
            snapshot.sensors[1].value = volume.first;
            snapshot.sensors[1].available = volume.second;

            auto absorptionSpeed = septic->getAbsorptionSpeed();
            snapshot.sensors[2].value = absorptionSpeed.first;
            snapshot.sensors[2].available = absorptionSpeed.second;

            auto incomingSpeed = septic->getIncomingSpeed();
            snapshot.sensors[3].value = incomingSpeed.first;
            snapshot.sensors[3].available = incomingSpeed.second;
        }
    }
}

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

// Writes the same layout EDConfig::StorageEEPROM::store() produces (raw Config
// bytes followed by a little-endian CRC16) so ConfigFileHandler/ConfigBackupHandler
// can validate it. EEPROM stays the source of truth; this file is an export mirror.
void writeConfigMirror()
{
    uint8_t data[sizeof(Config)];

    EEPROM.begin(EEPROM_SIZE);
    for (size_t i = 0; i < sizeof(data); i++) {
        data[i] = EEPROM.read(i);
    }
    EEPROM.end();

    uint16_t checksum = EDConfig::crc16(EDConfig::CRC16_INIT, data, sizeof(data));
    uint8_t trailer[sizeof(uint16_t)] = {
        (uint8_t)(checksum & 0xff),
        (uint8_t)((checksum >> 8) & 0xff)
    };

    File file = LittleFS.open("/config.bin", "wb");
    if (!file) {
        LOGE("setup", "failed to open config mirror for write");
        return;
    }

    size_t written = file.write(data, sizeof(data));
    written += file.write(trailer, sizeof(trailer));
    file.close();

    if (written != sizeof(data) + sizeof(trailer)) {
        LOGE("setup", "failed to write config mirror");
    }
}

// Applies a config previously staged by the backup/restore handlers before the
// regular configMgr.load() runs. Any validation failure keeps the existing
// EEPROM contents.
static bool restoreConfigFromMirror()
{
    const char* markerPath = "/config.restore.pending";
    const char* configPath = "/config.bin";

    if (!LittleFS.exists(markerPath)) {
        return false;
    }

    bool restored = false;

    File file = LittleFS.open(configPath, FILE_READ);
    if (!file) {
        LOGE("setup", "config restore pending but mirror is missing");
    } else {
        const size_t expectedSize = sizeof(Config) + sizeof(uint16_t);

        if ((size_t)file.size() != expectedSize) {
            LOGE("setup", "config restore invalid size");
        } else {
            uint8_t data[sizeof(Config)];
            uint8_t trailer[sizeof(uint16_t)];

            if (
                file.read(data, sizeof(data)) != sizeof(data)
                || file.read(trailer, sizeof(trailer)) != sizeof(trailer)
            ) {
                LOGE("setup", "failed to read config restore file");
            } else {
                const uint16_t storedChecksum = (uint16_t)(trailer[0] | ((uint16_t)trailer[1] << 8));
                const uint16_t calculatedChecksum = EDConfig::crc16(
                    EDConfig::CRC16_INIT,
                    data,
                    sizeof(data)
                );

                if (data[0] != CURRENT_VERSION) {
                    LOGE("setup", "config restore version mismatch");
                } else if (storedChecksum != calculatedChecksum) {
                    LOGE("setup", "config restore CRC mismatch");
                } else {
                    EEPROM.begin(EEPROM_SIZE);
                    for (size_t i = 0; i < sizeof(data); i++) {
                        EEPROM.write(i, data[i]);
                    }
                    EEPROM.put(sizeof(data), storedChecksum);
                    restored = EEPROM.commit();
                    EEPROM.end();

                    if (restored) {
                        LOGI("setup", "restored config from mirror");
                    } else {
                        LOGE("setup", "failed to persist restored config");
                    }
                }
            }
        }

        file.close();
    }

    LittleFS.remove(markerPath);

    return restored;
}

void setup()
{
    randomSeed(micros());

    Serial.begin(SERIAL_SPEED);

    esp_log_level_set("*", ESP_LOG_VERBOSE);

    LOGI("setup", "Shelby");
    LOGI("setup", "start");

    LittleFS.begin(true);

    configMgr.setDefault([](Config* config) {
        snprintf(config->networkConfig.wifiAPSSID, WIFI_SSID_LEN, "Shelby_%s", EDUtils::getMacAddress().c_str());
        snprintf(config->mqttTopicPrefix, MQTT_TOPIC_LEN, "shelby/%s", EDUtils::getChipID());
        snprintf(config->mqttHADiscoveryPrefix, MQTT_TOPIC_LEN, "homeassistant");
        config->modbusSpeed = 9600;
        config->addressQDY30A = 1;
        config->addressMR6C = 2;
        config->septicDiameter = 1.4f;
    });

    // A backup restore staged /config.bin and rebooted; apply it to EEPROM
    // before the normal load so configMgr.load() consumes the restored blob.
    restoreConfigFromMirror();

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

    Devices::controls.gates = gates;
    Devices::controls.switches[0] = lawnWateringRelay;
    Devices::controls.switches[1] = decorativeRelay;
    Devices::controls.switches[2] = parkingRelay;
    Devices::controls.switches[3] = streetRelay;

    // Refresh the export mirror before the HTTP server starts serving.
    writeConfigMirror();

    handler.init();

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

    static uint64_t lastSnapshotUpdateTime = 0;
    uint64_t now = esp_timer_get_time();
    if ((now - lastSnapshotUpdateTime) >= 500000) {
        lastSnapshotUpdateTime = now;
        Devices::updateSnapshot();
    }
}
