#include "state_mgr.h"

void StateMgr::loop()
{
    if (_nextUpdateTime < millis()) {
        if (_oldState != _newState && _producer->publish(&_newState)) {
            _oldState = _newState;
        }

        _nextUpdateTime = millis() + 500;
    }
}
