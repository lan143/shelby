#pragma once

#include <Arduino.h>
#include <WiFi.h>
#include <mqtt_config.h>
#include <network/network.h>

#define CURRENT_VERSION 3

struct Config
{
    uint8_t version = CURRENT_VERSION;

    EDNetwork::Config networkConfig;
    // MQTT
    EDMQTT::Config mqtt;

    bool mqttIsHADiscovery = true;
    char mqttHADiscoveryPrefix[MQTT_TOPIC_LEN] = {0};
    char mqttTopicPrefix[MQTT_TOPIC_LEN] = {0};

    // modbus
    uint32_t modbusSpeed = 0;
    uint8_t addressMR6C = 0;
    uint8_t addressQDY30A = 0;

    // septic
    float_t septicDiameter = 0.0f;
};

// Raw-read mirror of the pre-v3 Config layout, used only to migrate an existing
// EEPROM blob (same fields and order as v2, with the two separate MQTT topics).
// Must byte-match the previous struct exactly.
struct ConfigLegacyV2
{
    uint8_t version = 2;

    EDNetwork::Config networkConfig;
    // MQTT
    EDMQTT::Config mqtt;

    bool mqttIsHADiscovery = true;
    char mqttHADiscoveryPrefix[MQTT_TOPIC_LEN] = {0};
    char commandTopic[MQTT_TOPIC_LEN] = {0};
    char stateTopic[MQTT_TOPIC_LEN] = {0};

    // modbus
    uint32_t modbusSpeed = 0;
    uint8_t addressMR6C = 0;
    uint8_t addressQDY30A = 0;

    // septic
    float_t septicDiameter = 0.0f;
};

static_assert(sizeof(Config) == sizeof(ConfigLegacyV2) - MQTT_TOPIC_LEN, "Config must only shrink by the merged MQTT topic fields");
