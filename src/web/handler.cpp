#include <ArduinoJson.h>
#include <LittleFS.h>
#include <esp_system.h>
#include <ExtStrings.h>
#include <Json.h>
#include <backup/config_backup_handler.hpp>
#include <backup/config_file_handler.hpp>
#include <cstring>
#include <log/log.h>
#include <string.h>
#include "defines.h"
#include "control/devices.h"
#include "gates/gates.h"
#include "handler.h"

// Defined in main.cpp: exports the EEPROM config as the /config.bin mirror.
void writeConfigMirror();

namespace
{
    const EDConfig::BackupFileSpec BACKUP_FILES[] = {
        {"config.bin", "/config.bin", sizeof(Config), CURRENT_VERSION, true},
    };

    constexpr size_t BACKUP_FILE_COUNT = sizeof(BACKUP_FILES) / sizeof(BACKUP_FILES[0]);

    // Give the queued HTTP response time to flush, then reboot into the
    // boot-time restore path.
    void stageRestoreAndReboot()
    {
        File marker = LittleFS.open("/config.restore.pending", "w");
        if (marker) {
            marker.close();
        } else {
            LOGE("config", "failed to create restore marker");
        }

        delay(200);
        ESP.restart();
    }

    const char* coverStateString(int state)
    {
        switch ((GatesState)state)
        {
            case GATES_STATE_CLOSED:
                return "closed";
            case GATES_STATE_OPENING:
                return "opening";
            case GATES_STATE_CLOSING:
                return "closing";
            case GATES_STATE_OPENED:
                return "open";
        }

        return "closed";
    }

    void writeCover(JsonObject item, const char* id, const char* name, const Devices::CoverValue& value)
    {
        item["id"] = id;
        item["name"] = name;
        item["state"] = coverStateString(value.state);
        item["available"] = value.available;
    }

    void writeSwitch(JsonObject item, const char* id, const char* name, const Devices::SwitchValue& value)
    {
        item["id"] = id;
        item["name"] = name;
        item["enabled"] = value.available ? value.enabled : false;
        item["available"] = value.available;
    }

    void writeSensor(
        JsonObject item,
        const char* id,
        const char* name,
        const char* unit,
        const Devices::SensorValue& value
    )
    {
        item["id"] = id;
        item["name"] = name;
        item["unit"] = unit;
        item["value"] = value.available ? value.value : 0.0f;
        item["available"] = value.available;
    }

    void writeBinary(JsonObject item, const char* id, const char* name, const Devices::BinaryValue& value)
    {
        item["id"] = id;
        item["name"] = name;
        item["unit"] = "";
        item["value"] = value.available ? value.value : false;
        item["available"] = value.available;
    }

    void writeDevices(JsonObject root)
    {
        JsonArray sections = root["sections"].to<JsonArray>();

        JsonObject access = sections.add<JsonObject>();
        access["id"] = "access";
        access["name"] = "Access";
        JsonArray covers = access["covers"].to<JsonArray>();
        writeCover(covers.add<JsonObject>(), "gates", "Gates", Devices::snapshot.gates);
        writeCover(covers.add<JsonObject>(), "door", "Gates door mode", Devices::snapshot.door);
        JsonArray accessSensors = access["sensors"].to<JsonArray>();
        writeBinary(accessSensors.add<JsonObject>(), "gates_open", "Gates open", Devices::snapshot.gatesOpen);

        JsonObject lighting = sections.add<JsonObject>();
        lighting["id"] = "lighting";
        lighting["name"] = "Lighting";
        JsonArray switches = lighting["switches"].to<JsonArray>();
        writeSwitch(switches.add<JsonObject>(), "watering_the_lawn", "Watering the lawn", Devices::snapshot.switches[0]);
        writeSwitch(switches.add<JsonObject>(), "decorative_light", "Decorative light", Devices::snapshot.switches[1]);
        writeSwitch(switches.add<JsonObject>(), "parking_space_light", "Parking space light", Devices::snapshot.switches[2]);
        writeSwitch(switches.add<JsonObject>(), "street_light", "Street light", Devices::snapshot.switches[3]);

        JsonObject septicSection = sections.add<JsonObject>();
        septicSection["id"] = "septic";
        septicSection["name"] = "Septic tank";
        JsonArray sensors = septicSection["sensors"].to<JsonArray>();
        writeSensor(
            sensors.add<JsonObject>(),
            "septic_tank_filling_level",
            "Septic tank filling level",
            "m",
            Devices::snapshot.sensors[0]
        );
        writeSensor(
            sensors.add<JsonObject>(),
            "septic_tank_filling_volume",
            "Septic tank filling volume",
            "m³",
            Devices::snapshot.sensors[1]
        );
        writeSensor(
            sensors.add<JsonObject>(),
            "septic_tank_average_absorption_speed",
            "Septic tank average absorption speed",
            "L/h",
            Devices::snapshot.sensors[2]
        );
        writeSensor(
            sensors.add<JsonObject>(),
            "septic_tank_average_incoming_speed",
            "Septic tank average incoming speed",
            "L/h",
            Devices::snapshot.sensors[3]
        );
    }

    bool parseEnabled(const String& value, bool& out)
    {
        if (value.equalsIgnoreCase("on") || value.equalsIgnoreCase("true")) {
            out = true;
            return true;
        }

        if (value.equalsIgnoreCase("off") || value.equalsIgnoreCase("false")) {
            out = false;
            return true;
        }

        return false;
    }

    bool parseCoverCommand(const String& value, GatesCommand& out)
    {
        if (value.equalsIgnoreCase("open")) {
            out = GATES_COMMAND_OPEN;
            return true;
        }

        if (value.equalsIgnoreCase("close")) {
            out = GATES_COMMAND_CLOSE;
            return true;
        }

        if (value.equalsIgnoreCase("stop")) {
            out = GATES_COMMAND_STOP;
            return true;
        }

        return false;
    }

    int switchIndex(const String& id)
    {
        if (id == "watering_the_lawn") {
            return 0;
        }

        if (id == "decorative_light") {
            return 1;
        }

        if (id == "parking_space_light") {
            return 2;
        }

        if (id == "street_light") {
            return 3;
        }

        return -1;
    }
}

void Handler::init()
{
    _server->serveStatic("/", LittleFS, "/").setDefaultFile("index.html");

    _healthCheck->registerHandlers(_server);

    _networkApi->registerRoutes(*_server);

    _networkApi->onSettingsChanged([this](const EDNetwork::Config& cfg) {
        auto config = _configMgr->getData();

        config->networkConfig = cfg;

        return persistConfig();
    });

    // Archive route must be registered before the single-file /api/config
    // handler: ESPAsyncWebServer can match the shorter path first.
    static EDConfig::ConfigBackupHandler backupHandler({
        BACKUP_FILES,
        BACKUP_FILE_COUNT,
        "shelby-config.zip",
        0,
        stageRestoreAndReboot
    });
    backupHandler.registerHandlers(_server);

    static EDConfig::ConfigFileHandler configFileHandler({
        "/config.bin",
        sizeof(Config),
        CURRENT_VERSION,
        true,
        stageRestoreAndReboot
    });
    configFileHandler.registerHandlers(_server);

    _server->on("/api/settings/modbus", HTTP_GET, [this](AsyncWebServerRequest *request) {
        AsyncResponseStream *response = request->beginResponseStream("application/json");

        std::string payload = EDUtils::buildJson([this](JsonObject entity) {
            auto config = _configMgr->getData();

            entity["modbusSpeed"] = config->modbusSpeed;
            entity["addressMR6C"] = config->addressMR6C;
            entity["addressQDY30A"] = config->addressQDY30A;
        });

        response->write(payload.c_str());
        request->send(response);
    });

    _server->on("/api/settings/modbus", HTTP_POST, [this](AsyncWebServerRequest *request) {
        if (
            !request->hasParam("modbusSpeed", true)
            || !request->hasParam("addressMR6C", true)
            || !request->hasParam("addressQDY30A", true)
        ) {
            request->send(422, "application/json", "{\"message\": \"not present modbus params in request\"}");
            return;
        }

        const AsyncWebParameter* modbusSpeedParam = request->getParam("modbusSpeed", true);
        const AsyncWebParameter* addressMR6CParam = request->getParam("addressMR6C", true);
        const AsyncWebParameter* addressQDY30AParam = request->getParam("addressQDY30A", true);

        int modbusSpeed;
        if (EDUtils::str2int(&modbusSpeed, modbusSpeedParam->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS) {
            request->send(422, "application/json", "{\"message\": \"Incorrect modbus speed\"}");
            return;
        }

        switch (modbusSpeed) {
            case 1200:
                break;
            case 2400:
                break;
            case 4800:
                break;
            case 9600:
                break;
            case 19200:
                break;
            case 38400:
                break;
            case 57600:
                break;
            case 115200:
                break;
            default:
                request->send(422, "application/json", "{\"message\": \"Unsupported modbus speed\"}");
                return;
        }

        int addressMR6C;
        if (EDUtils::str2int(&addressMR6C, addressMR6CParam->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS
            || addressMR6C < 1 || addressMR6C > 254) {
            request->send(422, "application/json", "{\"message\": \"Incorrect address WB-MR6C\"}");
            return;
        }

        int addressQDY30A;
        if (EDUtils::str2int(&addressQDY30A, addressQDY30AParam->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS
            || addressQDY30A < 1 || addressQDY30A > 254) {
            request->send(422, "application/json", "{\"message\": \"Incorrect address QDY30A\"}");
            return;
        }

        auto config = _configMgr->getData();
        if (modbusSpeed != config->modbusSpeed) {
            _modbus->changeSpeed(modbusSpeed);
        }

        config->modbusSpeed = modbusSpeed;
        config->addressMR6C = addressMR6C;
        config->addressQDY30A = addressQDY30A;

        if (!persistConfig()) {
            request->send(500, "application/json", "{\"message\": \"Failed to update config\"}");
            return;
        }

        request->send(200, "application/json", "{}");
    });

    // specific /api/settings/* routes MUST be registered before bare /api/settings (BackwardCompatible URI matching: exact OR prefix + '/')
    // Plaintext MQTT password matches the exposure the device already had.
    _server->on("/api/settings/mqtt", HTTP_GET, [this](AsyncWebServerRequest *request) {
        AsyncResponseStream *response = request->beginResponseStream("application/json");

        std::string payload = EDUtils::buildJson([this](JsonObject entity) {
            auto config = _configMgr->getData();

            entity["host"] = config->mqtt.host;
            entity["port"] = config->mqtt.port;
            entity["login"] = config->mqtt.login;
            entity["password"] = config->mqtt.password;
            entity["haDiscoveryPrefix"] = config->mqttHADiscoveryPrefix;
            entity["mqttIsHADiscovery"] = config->mqttIsHADiscovery;
            entity["mqttTopicPrefix"] = config->mqttTopicPrefix;
        });

        response->write(payload.c_str());
        request->send(response);
    });

    _server->on("/api/settings/mqtt", HTTP_POST, [this](AsyncWebServerRequest *request) {
        if (
            !request->hasParam("host", true)
            || !request->hasParam("port", true)
            || !request->hasParam("login", true)
            || !request->hasParam("password", true)
            || !request->hasParam("haDiscoveryPrefix", true)
            || !request->hasParam("mqttIsHADiscovery", true)
            || !request->hasParam("mqttTopicPrefix", true)
        ) {
            request->send(422, "application/json", "{\"message\": \"not present mqtt params in request\"}");
            return;
        }

        auto config = _configMgr->getData();
        const AsyncWebParameter* host = request->getParam("host", true);
        const AsyncWebParameter* port = request->getParam("port", true);
        const AsyncWebParameter* login = request->getParam("login", true);
        const AsyncWebParameter* password = request->getParam("password", true);
        const AsyncWebParameter* haDiscoveryPrefix = request->getParam("haDiscoveryPrefix", true);
        const AsyncWebParameter* ishaDiscoveryEnabled = request->getParam("mqttIsHADiscovery", true);
        const AsyncWebParameter* topicPrefix = request->getParam("mqttTopicPrefix", true);

        if (host->value().length() == 0 || host->value().length() > HOST_LEN-1) {
            request->send(422, "application/json", "{\"message\": \"MQTT host lenght invalid\"}");
            return;
        }

        int mqttPort;
        if (EDUtils::str2int(&mqttPort, port->value().c_str(), 10) != EDUtils::STR2INT_SUCCESS) {
            request->send(422, "application/json", "{\"message\": \"Incorrect port\"}");
            return;
        }

        if (login->value().length() > MQTT_LOGIN_LEN-1) {
            request->send(422, "application/json", "{\"message\": \"MQTT login length invalid\"}");
            return;
        }

        if (password->value().length() > MQTT_PASSWORD_LEN-1) {
            request->send(422, "application/json", "{\"message\": \"MQTT password length invalid\"}");
            return;
        }

        if (haDiscoveryPrefix->value().length() == 0) {
            request->send(422, "application/json", "{\"message\": \"You must specify mqtt topic name\"}");
            return;
        }

        if (haDiscoveryPrefix->value().length() > MQTT_TOPIC_LEN-1) {
            request->send(422, "application/json", "{\"message\": \"HA discovery prefix length invalid\"}");
            return;
        }

        if (topicPrefix->value().length() == 0 || topicPrefix->value().length() > MQTT_TOPIC_LEN-1) {
            request->send(422, "application/json", "{\"message\": \"MQTT topic prefix length invalid\"}");
            return;
        }

        if (
            topicPrefix->value().startsWith("/")
            || topicPrefix->value().endsWith("/")
            || topicPrefix->value().indexOf(' ') != -1
        ) {
            request->send(422, "application/json", "{\"message\": \"MQTT topic prefix format invalid\"}");
            return;
        }

        strcpy(config->mqtt.host, host->value().c_str());
        config->mqtt.port = (uint16_t)mqttPort;
        strcpy(config->mqtt.login, login->value().c_str());
        strcpy(config->mqtt.password, password->value().c_str());
        strcpy(config->mqttHADiscoveryPrefix, haDiscoveryPrefix->value().c_str());
        strcpy(config->mqttTopicPrefix, topicPrefix->value().c_str());

        if (strcmp(ishaDiscoveryEnabled->value().c_str(), "true") == 0) {
            config->mqttIsHADiscovery = true;
        } else {
            config->mqttIsHADiscovery = false;
        }

        if (!persistConfig()) {
            request->send(500, "application/json", "{\"message\": \"Failed to update config\"}");
            return;
        }

        request->send(200, "application/json", "{}");
    });

    _server->on("/api/settings", HTTP_GET, [this](AsyncWebServerRequest *request) {
        AsyncResponseStream *response = request->beginResponseStream("application/json");

        std::string payload = EDUtils::buildJson([this](JsonObject entity) {
            auto config = _configMgr->getData();

            entity["septicDiameter"] = config->septicDiameter;
        });

        response->write(payload.c_str());
        request->send(response);
    });

    _server->on("/api/settings", HTTP_POST, [this](AsyncWebServerRequest *request) {
        if (!request->hasParam("septicDiameter", true)) {
            request->send(422, "application/json", "{\"message\": \"not present mqtt params in request\"}");
            return;
        }

        auto config = _configMgr->getData();
        const AsyncWebParameter* septicDiameterParam = request->getParam("septicDiameter", true);

        float_t septicDiameter;
        if (EDUtils::str2float(&septicDiameter, septicDiameterParam->value().c_str()) != EDUtils::STR2INT_SUCCESS
            || septicDiameter < 0.0f) {
            request->send(422, "application/json", "{\"message\": \"Incorrect septic diameter\"}");
            return;
        }

        config->septicDiameter = septicDiameter;

        if (!persistConfig()) {
            request->send(500, "application/json", "{\"message\": \"Failed to update config\"}");
            return;
        }

        request->send(200, "application/json", "{}");
    });

    _server->on("/api/devices", HTTP_GET, [this](AsyncWebServerRequest *request) {
        AsyncResponseStream *response = request->beginResponseStream("application/json");

        std::string payload = EDUtils::buildJson([](JsonObject root) {
            writeDevices(root);
        });

        response->write(payload.c_str());
        request->send(response);
    });

    _server->on("/api/devices/set", HTTP_POST, [this](AsyncWebServerRequest *request) {
        handleDeviceSet(request);
    });

    _server->on("/api/status", HTTP_GET, [this](AsyncWebServerRequest *request) {
        AsyncResponseStream *response = request->beginResponseStream("application/json");

        std::string data = EDUtils::buildJson([this](JsonObject entity) {
            if (_networkMgr->isConnected()) {
                entity[F("wifiStatus")] = "connected";
            } else {
                entity[F("wifiStatus")] = "disconnected";
            }

            entity[F("freeHeap")] = ESP.getFreeHeap();
            entity[F("uptime")] = esp_timer_get_time() / 1000000;

            esp_reset_reason_t reason = esp_reset_reason();

            switch (reason) {
                case ESP_RST_POWERON:
                    entity[F("lastResetReason")] = "Power-on Reset";
                    break;
                case ESP_RST_EXT:
                    entity[F("lastResetReason")] = "External Reset";
                    break;
                case ESP_RST_SW:
                    entity[F("lastResetReason")] = "Software Reset";
                    break;
                case ESP_RST_PANIC:
                    entity[F("lastResetReason")] = "Panic Reset";
                    break;
                case ESP_RST_INT_WDT:
                    entity[F("lastResetReason")] = "Interrupt Watchdog Reset";
                    break;
                case ESP_RST_TASK_WDT:
                    entity[F("lastResetReason")] = "Task Watchdog Reset";
                    break;
                case ESP_RST_WDT:
                    entity[F("lastResetReason")] = "Other Watchdog Reset";
                    break;
                case ESP_RST_DEEPSLEEP:
                    entity[F("lastResetReason")] = "Wake from Deep Sleep";
                    break;
                case ESP_RST_BROWNOUT:
                    entity[F("lastResetReason")] = "Brownout Reset";
                    break;
                case ESP_RST_SDIO:
                    entity[F("lastResetReason")] = "SDIO Reset";
                    break;
                default:
                    entity[F("lastResetReason")] = "Unknown";
                    break;
            }

            entity[F("fwVersion")] = deviceFWVersion;
        });
        response->print(data.c_str());
        request->send(response);
    });

    _server->on("/api/reboot", HTTP_POST, [this](AsyncWebServerRequest *request) {
        request->send(200, "application/json", "{}");
        delay(200);
        ESP.restart();
    });

    _server->begin();
}

bool Handler::persistConfig()
{
    if (!_configMgr->store()) {
        return false;
    }

    // EEPROM is the source of truth; the LittleFS mirror is only an export
    // used by the backup endpoints. A mirror failure must not fail the save.
    writeConfigMirror();

    return true;
}

void Handler::handleDeviceSet(AsyncWebServerRequest* request)
{
    if (!request->hasParam("id", true)) {
        request->send(422, "application/json", "{\"message\": \"not present device params in request\"}");
        return;
    }

    const String id = request->getParam("id", true)->value();
    const bool hasCommand = request->hasParam("command", true);
    const bool hasEnabled = request->hasParam("enabled", true);

    if (id == "gates" || id == "door") {
        if (hasEnabled) {
            request->send(422, "application/json", "{\"message\": \"field not supported by device\"}");
            return;
        }

        if (!hasCommand) {
            request->send(422, "application/json", "{\"message\": \"not present device params in request\"}");
            return;
        }

        GatesCommand command;
        if (!parseCoverCommand(request->getParam("command", true)->value(), command)) {
            request->send(422, "application/json", "{\"message\": \"incorrect command value\"}");
            return;
        }

        if (Devices::controls.gates == nullptr) {
            request->send(500, "application/json", "{\"message\": \"device not ready\"}");
            return;
        }

        if (id == "gates") {
            Devices::controls.gates->gatesChange(command);
        } else {
            Devices::controls.gates->doorChange(command);
        }

        request->send(200, "application/json", "{}");
        return;
    }

    const int index = switchIndex(id);
    if (index < 0) {
        request->send(422, "application/json", "{\"message\": \"unknown id\"}");
        return;
    }

    if (hasCommand) {
        request->send(422, "application/json", "{\"message\": \"field not supported by device\"}");
        return;
    }

    if (!hasEnabled) {
        request->send(422, "application/json", "{\"message\": \"not present device params in request\"}");
        return;
    }

    bool enable = false;
    if (!parseEnabled(request->getParam("enabled", true)->value(), enable)) {
        request->send(422, "application/json", "{\"message\": \"incorrect enabled value\"}");
        return;
    }

    if (Devices::controls.switches[index] == nullptr) {
        request->send(500, "application/json", "{\"message\": \"device not ready\"}");
        return;
    }

    if (!Devices::controls.switches[index]->setState(enable)) {
        request->send(500, "application/json", "{\"message\": \"device not ready\"}");
        return;
    }

    request->send(200, "application/json", "{}");
}
