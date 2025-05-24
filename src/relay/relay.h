#pragma once

#include <discovery.h>
#include <entity/device.h>

class Relay {
public:
    Relay() {}

    void init(int pin, bool reverse);
    void activate(bool isOn);

private:
    int _pin;
    bool _reverse;
};
