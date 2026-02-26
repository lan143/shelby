#pragma once

#include <Arduino.h>
#include <WiFi.h>
#include <mqtt_config.h>
#include <network/network.h>

#define CURRENT_VERSION 2

#define WIFI_SSID_LEN 32 + 1
#define WIFI_PWD_LEN 64 + 1

#define HOST_LEN 64
#define MQTT_DEFAULT_PORT 1883

#define MQTT_LOGIN_LEN 32
#define MQTT_PASSWORD_LEN 32
#define MQTT_TOPIC_LEN 64

struct Config
{
    uint8_t version = CURRENT_VERSION;

    EDNetwork::Config networkConfig;
    // MQTT
    EDMQTT::Config mqtt;

    bool mqttIsHADiscovery = true;
    char mqttHADiscoveryPrefix[MQTT_TOPIC_LEN] = {0};
    char mqttCommandTopic[MQTT_TOPIC_LEN] = {0};
    char mqttStateTopic[MQTT_TOPIC_LEN] = {0};

    // modbus
    uint32_t modbusSpeed = 0;
    uint8_t addressMR6C = 0;
    uint8_t addressQDY30A = 0;

    // septic
    float_t septicDiameter = 0.0f;
};
