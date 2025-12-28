#pragma once

#include <Arduino.h>

class Command
{
public:
    bool unmarshalJSON(const char* data);

    bool hasGatesPayload() { return _hasGatesPayload; }
    std::string getGatesPayload() { return _gatesPayload;}

    bool hasDoorPayload() { return _hasDoorPayload; }
    std::string getDoorPayload() { return _doorPayload; }

    bool hasWateringLawn() { return _hasWateringLawn; }
    bool isEnabledWateringLawn() { return _isEnabledWateringLawn; }

    bool hasParkingLight() { return _hasParkingLight; }
    bool isEnabledParkingLight() { return _isEnabledParkingLight; }

    bool hasStreetLight() { return _hasStreetLight; }
    bool isEnabledStreetLight() { return _isEnabledStreetLight; }

    bool hasDecorativeLight() { return _hasDecorativeLight; }
    bool isEnabledDecorativeLight() { return _isEnabledDecorativeLight; }

private:
    bool _hasGatesPayload = false;
    std::string _gatesPayload = "";

    bool _hasDoorPayload = false;
    std::string _doorPayload = "";

    bool _hasWateringLawn = false;
    bool _isEnabledWateringLawn = false;

    bool _hasParkingLight = false;
    bool _isEnabledParkingLight = false;

    bool _hasStreetLight = false;
    bool _isEnabledStreetLight = false;

    bool _hasDecorativeLight = false;
    bool _isEnabledDecorativeLight = false;
};
