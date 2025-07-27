#include "state_mgr.h"

State StateMgr::buildState()
{
    return State(
        _gatesState,
        _doorState,
        _wateringLawnEnabled,
        _septicFillingLevel
    );
}

void StateMgr::publishState()
{
    State state = buildState();
    _producer->publish(&state);
}

void StateMgr::loop()
{
    if ((_lastUpdateStateTime + 20000) < millis()) {
        publishState();
        _lastUpdateStateTime = millis();
    }
}