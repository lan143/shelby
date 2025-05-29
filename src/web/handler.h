#pragma once

#ifdef ESP32
    #include <AsyncTCP.h>
#elif defined(ESP8266)
    #include <ESPAsyncTCP.h>
#endif

#include <ESPAsyncWebServer.h>
#include <ConfigMgr.h>
#include <healthcheck.h>

#include "config.h"
#include "network/network.h"

class Handler {
public:
    Handler(
        EDConfig::ConfigMgr<Config>* configMgr,
        NetworkMgr* networkMgr,
        EDHealthCheck::HealthCheck* healthCheck
    ) : _configMgr(configMgr), _networkMgr(networkMgr), _healthCheck(healthCheck) {
        _server = new AsyncWebServer(80);
    }

    void init();

private:
    AsyncWebServer* _server;
    EDConfig::ConfigMgr<Config>* _configMgr;
    NetworkMgr* _networkMgr;
    EDHealthCheck::HealthCheck* _healthCheck;
};
