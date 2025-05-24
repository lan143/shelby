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

private:
    bool _hasGatesPayload = false;
    std::string _gatesPayload = "";

    bool _hasDoorPayload = false;
    std::string _doorPayload = "";
};
