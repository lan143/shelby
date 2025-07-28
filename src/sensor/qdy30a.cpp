#include "qdy30a.h"

void QDY30A::init(EDHA::Device* device, std::string stateTopic, uint8_t address)
{
    _address = address;

    const char* chipID = EDUtils::getChipID();
    _discoveryMgr->addSensor(
        device,
        "Septic tank filling level",
        "septicFillingLevel",
        EDUtils::formatString("septic_filling_shelby_%s", chipID)
    )
        ->setStateTopic(stateTopic)
        ->setValueTemplate("{{ value_json.septicFillingLevel }}")
        ->setUnitOfMeasurement("m")
        ->setDeviceClass("precipitation");

    for (int i = 0; i < 20; i++) {
        _unitOfMeasurement = _client->holdingRegisterRead(_address, 0x0002);
        _dotPosition = _client->holdingRegisterRead(_address, 0x0003);

        if (_unitOfMeasurement != -1 && _dotPosition != -1) {
            break;
        }

        delay(500);
    }
}

void QDY30A::loop()
{
    if ((_lastUpdateTime + 60000) < millis()) {
        int32_t level = _client->holdingRegisterRead(_address, 0x0004);
        if (level == -1) {
            _lastUpdateTime = millis();
            return;
        }

        float_t convertLevel;

        switch (_dotPosition) {
            case 1:
                convertLevel = (float_t)level / 10.0f;
                break;
            case 2:
                convertLevel = (float_t)level / 100.0f;
                break;
            case 3:
                convertLevel = (float_t)level / 1000.0f;
                break;
        }

        switch (_unitOfMeasurement) {
            case 1:
            case 17:
                convertLevel /= 100.0f;
                break;
            case 2:
                convertLevel /= 1000.0f;
                break;
        }

        _stateMgr->setSepticFillingLevel(convertLevel);
        _lastUpdateTime = millis();
    }
}
