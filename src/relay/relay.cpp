#include <ExtStrings.h>
#include "relay.h"

void Relay::init(int pin, bool reverse)
{
    _pin = pin;
    _reverse = reverse;

    pinMode(pin, OUTPUT);
    digitalWrite(pin, !_reverse ? LOW : HIGH);
}

void Relay::activate(bool isOn)
{
    if (isOn) {
        digitalWrite(_pin, _reverse ? LOW : HIGH);
    } else {
        digitalWrite(_pin, _reverse ? HIGH : LOW);
    }
}
