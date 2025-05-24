#include "state_mgr.h"

State StateMgr::buildState()
{
    return State(
        _gatesState,
        _doorState
    );
}

void StateMgr::publishState()
{
    State state = buildState();
    _producer->publish(&state);
}
