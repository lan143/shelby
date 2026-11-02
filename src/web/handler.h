#pragma once

#ifdef ESP32
    #include <AsyncTCP.h>
#elif defined(ESP8266)
    #include <ESPAsyncTCP.h>
#endif

#include <ESPAsyncWebServer.h>
#include <data_mgr.h>
#include <healthcheck.h>
#include <network/network.h>
#include <network/network_api.h>
#include <wirenboard.h>

#include "config.h"

class Handler {
public:
    Handler(
        EDConfig::DataMgr<Config>* configMgr,
        EDNetwork::NetworkMgr* networkMgr,
        EDNetwork::NetworkApi* networkApi,
        EDHealthCheck::HealthCheck* healthCheck,
        EDWB::WirenBoard* modbus
    ) : _configMgr(configMgr), _networkMgr(networkMgr), _networkApi(networkApi),
        _healthCheck(healthCheck), _modbus(modbus) {
        _server = new AsyncWebServer(80);
    }

    void init();

private:
    void handleDeviceSet(AsyncWebServerRequest* request);
    bool persistConfig();

private:
    AsyncWebServer* _server;
    EDConfig::DataMgr<Config>* _configMgr;
    EDNetwork::NetworkMgr* _networkMgr;
    EDNetwork::NetworkApi* _networkApi;
    EDHealthCheck::HealthCheck* _healthCheck;
    EDWB::WirenBoard* _modbus;
};
