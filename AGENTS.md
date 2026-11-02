# AGENTS.md

Firmware **Shelby** for a home-automation controller on the ESP32 board **Kincony KC868-A2**. Stack: PlatformIO, Arduino framework, ESP32 (`espressif32`), C++ with vendored `ed-*` libraries, SPIFFS web UI, MQTT/Home Assistant. Repository: `git@github.com:lan143/shelby.git`, branch `main`. Read `RTK.md` for the command-output conventions used in this repo.

## Build & deploy

| Task | Command | Notes |
|---|---|---|
| Build | `pio run -e kc868a2` | USB target, `board=esp32dev` |
| Flash firmware | `pio run -e kc868a2 -t upload` | USB |
| Flash web assets | `pio run -e kc868a2 -t uploadfs` | First install and after any `data/` change; SPIFFS |
| OTA firmware | `pio run -e kc868a2_ota -t upload` | `kc868a2_ota` extends `kc868a2`; espota to `192.168.1.35` with `--auth=<password>` |
| Serial monitor | `pio device monitor` | 115200 baud; build diagnostics via `rtk err` / `rtk summary` (see `RTK.md`) |

There are **no tests, no CI, and no linter** beyond `-Wshadow`. Verification is: compile, flash, observe serial output at 115200, and confirm state/commands in Home Assistant.

Build flags: `-Wshadow`, `-DCORE_DEBUG_LEVEL=5`, `-DCONFIG_LOG_COLORS=1`. `board_build.filesystem = spiffs`.

## Repository map

| Path | Owns |
|---|---|
| `src/main.cpp` | Composition root: globals, dependency wiring, `setup()`, `loop()` |
| `src/defines.h` | Pin map, RS485/Ethernet constants, device identity strings |
| `src/config.h` | `Config` struct (`CURRENT_VERSION = 2`), EEPROM-backed settings |
| `src/gates/gates.cpp/.h`, `gates_state.h` | Gate/door state machines, relay pulses, end-position sensing; classes `Gates`, `GatesState` |
| `src/relay/relay.cpp/.h` | Native relay abstraction `Relay` (`reverse` flag) |
| `src/relay/wb_relay.cpp/.h` | WB-MR6C relay channels, switch discovery, watering auto-off; class `WbRelay` |
| `src/sensor/binary_sensor.cpp/.h` | MR6C input 1 as gate-open binary sensor; class `BinarySensor` |
| `src/sensor/qdy30a.cpp/.h` | QDY-30A ultrasonic level, volume and speed calculations; class `QDY30A` |
| `src/state/state.cpp/.h` | Domain state and `marshalJSON()` |
| `src/state/producer.cpp/.h` | `StateProducer`: publishes state JSON (non-retained) |
| `src/command/command.cpp/.h` | `Command`: parses command JSON |
| `src/command/command_consumer.cpp/.h` | `CommandConsumer`: dispatches commands to gates and relays |
| `src/web/handler.cpp/.h` | `Handler`: ESPAsyncWebServer on port 80, static SPIFFS UI, REST API |
| `data/` | SPIFFS web UI: `index.html`, `index.js`, Bootstrap, jQuery |
| `platformio.ini` | Environments, libraries, build flags, OTA settings |
| `.pio/libdeps/kc868a2/` | Vendored library sources; read-only, never edit |

`.pio/` and `data/*.min.*` are third-party/vendor artifacts: do not reformat or patch them.

## Hardware

| Function | GPIO / setting | Notes |
|---|---|---|
| Gate relay | `RELAY_GATE` = 2 | Native relay, `reverse=false` |
| Door relay | `RELAY_DOOR` = 15 | Native relay, `reverse=false` |
| Gate open end signal | `GATE_OPEN` = 36 | `INPUT`, active low (`digitalRead() == 0`) |
| Gate close end signal | `GATE_CLOSE` = 39 | `INPUT`, active low (`digitalRead() == 0`) |
| RS485 RX | 35 | `Serial2`, `SERIAL_8N1` |
| RS485 TX | 32 | Speed from config, default 9600 |
| Ethernet PHY | LAN8720 | `ETH_ADDR=0`, power pin `-1`, MDC 23, MDIO 18, clock `ETH_CLOCK_GPIO17_OUT` |
| Config EEPROM | 1500 bytes | `EEPROM_SIZE` |

The KC868-A2 has a built-in RJ45 Ethernet port. The board identity is: name `Shelby`, model `KC868-A2`, manufacturer `Kincony`, HW `1.0.0`, FW `0.1.0`.

### RS485 devices

| Device | Default address | Usage |
|---|---|---|
| WB-MR6C | 2 | Relays 1, 4, 5, 6; inputs 0,1,2,3,4,6 set to frequency mode. Input 1 is later switched to `DONT_USE` and used as the gate end-position input. |
| QDY-30A | 1 | Holding regs `0x0002` (unit) and `0x0003` (dot position) read once at boot; level reg `0x0004` polled every 60 s |

MR6C channel map: 1 = lawn watering, 4 = decorative light, 5 = parking light, 6 = street light.

## Runtime architecture

`setup()` constructs global objects (constructor dependency injection), loads config from EEPROM, initializes SPIFFS, network, OTA, MQTT, discovery, gates, MR6C, binary sensor, command consumer and QDY-30A.

`loop()` order is significant: `networkMgr.loop()`, `discoveryMgr.loop()`, `ArduinoOTA.handle()`, `gates.loop()`, `stateMgr.loop()`, `healthCheck.loop()`, `qdy30a.loop()`, `networkLogger.update()`, `binarySensor->update()`, `wbRelay->update()`.

State flow: modules mutate `State` through `EDUtils::StateMgr<State>`. `StateMgr` compares old/new state and publishes at most every 500 ms when changed. `StateProducer` serializes `State::marshalJSON()` to the state topic with `retained=false`.

Command flow: MQTT subscription -> `CommandConsumer::consume()` -> `Command::unmarshalJSON()` -> dispatch to `Gates` and `WbRelay`.

Timing: all periodic work is non-blocking and scheduled with `esp_timer_get_time()` in microseconds. Do not add blocking `delay()` to `loop()` or module updates.

Network: Ethernet is started first (`hasEth=true`); after repeated connection failures it falls back to Wi-Fi client mode (if `isAPMode=false`) and then to SoftAP. In AP mode the device serves the UI at `http://192.168.4.1/`. Network connect/disconnect callbacks enable/disable the remote logger and connect/disconnect MQTT.

## MQTT contract

Default topics (set in `configMgr.setDefault()`):

| Purpose | Default |
|---|---|
| State | `shelby/<chipID>/state` |
| Command | `shelby/<chipID>/set` |
| HA discovery prefix | `homeassistant` |
| MQTT broker port | `1883` |

State JSON keys (`src/state/state.cpp`):

| Key | Type / values | Omission |
|---|---|---|
| `gates_state` | string: `closed`, `opening`, `closing`, `open` | never |
| `door_state` | string: `closed`, `opening`, `closing`, `open` | never |
| `wateringLawnRelay` | string: `"true"`, `"false"` | never |
| `parkingLight` | string: `"true"`, `"false"` | never |
| `streetLight` | string: `"true"`, `"false"` | never |
| `decorativeLight` | string: `"true"`, `"false"` | never |
| `septicFillingLevel` | number, m | omitted when 0 |
| `septicFillingVolume` | number, m³ | omitted when 0 |
| `septicAvgAbsorptionSpeed` | number, L/h | always |
| `septicAvgIncomingSpeed` | number, L/h | always |
| `isGatesOpen` | string: `"true"`, `"false"` | omitted until first reading |

Command JSON keys (`src/command/command.cpp`):

| Key | Values |
|---|---|
| `gates_payload` | `open`, `close`; anything else maps to stop |
| `door_payload` | `open`, `close`; anything else maps to stop |
| `wateringLawnRelay` | string/bool compared to `"true"` |
| `parkingLight` | string/bool compared to `"true"` |
| `streetLight` | string/bool compared to `"true"` |
| `decorativeLight` | string/bool compared to `"true"` |

HA discovery entities:

| Name | Type | unique_id | Value template |
|---|---|---|---|
| Gates | cover, class `gate` | `gates_cover_shelby` | `{{ value_json.gates_state }}` |
| Gates door mode | cover, class `door` | `gates_door_mode_cover_shelby` | `{{ value_json.door_state }}` |
| Gates | binary_sensor, class `garage_door` | `gates_shelby_<chipID>` | `{{ value_json.isGatesOpen }}` |
| Watering the lawn | switch | `watering_lawn_relay_shelby_<chipID>` | `{{ value_json.wateringLawnRelay }}` |
| Parking space light | switch | `parking_space_relay_shelby_<chipID>` | `{{ value_json.parkingLight }}` |
| Street light | switch | `street_light_relay_shelby_<chipID>` | `{{ value_json.streetLight }}` |
| Decorative light | switch | `decorative_light_relay_shelby_<chipID>` | `{{ value_json.decorativeLight }}` |
| Septic tank filling level | sensor, m | `septic_filling_shelby_<chipID>` | `{{ value_json.septicFillingLevel }}` |
| Septic tank filling volume | sensor, m³, `volume_storage` | `septic_filling_volume_shelby_<chipID>` | `{{ value_json.septicFillingVolume }}` |
| Septic tank average absorption speed | sensor, L/h, `volume_flow_rate` | `septic_avg_absorption_speed_shelby_<chipID>` | `{{ value_json.septicAvgAbsorptionSpeed }}` |
| Septic tank average incoming speed | sensor, L/h, `volume_flow_rate` | `septic_avg_incoming_speed_shelby_<chipID>` | `{{ value_json.septicAvgIncomingSpeed }}` |

Volume and speed sensors are created only when `septicDiameter != 0`. Discovery configs are published retained; state is published non-retained.

## Domain invariants — do not break

- Gate commands are ignored unless the door is `CLOSED`; door commands are ignored unless the gates are `CLOSED`.
- `skipCommand` matrix: `OPEN` only from `CLOSED`; `CLOSE` only from `OPENED`; `STOP` only from `OPENING`/`CLOSING`.
- `STOP` resolves to `OPENED`, not an unknown state.
- Native gate/door relays are momentary pulses: ON, then OFF after 0.2 s (200000 µs).
- End signals are sampled every 1 ms into counters constrained to 0..50; motor movement is detected above 25.
- Motor transitions are evaluated every 0.5 s; opening while both are closed enters `OPENING`, end of opening with `isGatesOpen` enters `OPENED`, closing from `OPENED` enters `CLOSING`, end of motion sets both `CLOSED`.
- MR6C input 1 is first set to frequency mode by `WbRelay::init()` and then overridden to `DONT_USE` by `BinarySensor::init()`; the init order in `main.cpp` is a dependency.
- Lawn watering turns off automatically after 20 minutes (`1200000000` µs). Only channel 1 is reconciled every 1 s; channels 4, 5, 6 are fire-and-forget.
- QDY-30A is polled every 60 s; readings above 3.5 m are rejected; speeds use 10-sample ring buffers and reset to 0 after 5 minutes without updates; the sensor is "not ready" after 10 minutes without a valid reading.
- State publish is non-retained; discovery publish is retained.
- A config schema change requires bumping `CURRENT_VERSION` in `src/config.h`.

## Conventions

- C++ style: 4-space indentation, Allman braces, `_camelCase` private members, `PascalCase` classes, one class per `.h`/`.cpp` pair under `src/<module>/`.
- Logging: `LOGx(tag, msg)` macros from `ed-utils`.
- Dependency wiring lives in `src/main.cpp` only; modules receive collaborators via constructors.
- Adding an HA entity: add the entity in the owning module's `init()`, add/confirm its key in `State`/`marshalJSON()`, add a command key if controllable (`Command` + `CommandConsumer`), and update the MQTT contract above.
- Adding a config field: update `src/config.h`, defaults in `configMgr.setDefault()` (`src/main.cpp`), the relevant `/api/settings*` GET/POST handler, the UI form in `data/index.html`/`index.js`, and bump `CURRENT_VERSION`.
- Never write real WiFi, MQTT or OTA credentials into docs, tests or commits; use placeholders such as `<password>`.

## Gotchas & risks

- `src/web/handler.cpp` includes `"Handler.h"` (capital H) while the file is `handler.h`. It compiles on case-insensitive macOS but breaks on case-sensitive filesystems. Do not silently rename or "fix" it; flag it.
- The OTA password is hardcoded twice (`ArduinoOTA::setPassword()` in `src/main.cpp` and `--auth=` in `platformio.ini`). The remote logger host/port/URI are also hardcoded in `src/main.cpp` with a `@todo: move to config`. Never copy the actual secret values into documentation.
- The web API has no authentication; WiFi/MQTT credentials are stored as plaintext in EEPROM. Use only on a trusted, isolated LAN. The default AP has no password (`wifiAPHasPassword=false`).
- `/healthcheck/healty` is a real typo in the `ed-healthcheck` library, not app code. `/healthcheck/ready` is also exposed.
- `GET /api/wifi/list` exists but its body is fully commented out; it is non-functional.
- The MR6C input-1 mode override depends on `WbRelay::init()` running before `BinarySensor::init()`.
- `STOP` sets `OPENED`; do not assume `unknown`.
- Lawn watering auto-off is intentional; do not remove it as a "stuck relay" bug.
- State is non-retained while discovery is retained; do not flip these without checking HA entity availability.
- Do not edit `.pio/` or minified vendor assets; do not reformat vendored libraries.

## Never do

- Never commit or document real WiFi/MQTT/OTA secrets.
- Never add blocking `delay()` calls to `loop()` or module update paths.
- Never silently "fix" the `Handler.h` include case; flag it in the change/report.
- Never change state keys, command keys or the config schema without updating HA templates, the web UI, docs and `CURRENT_VERSION`.
- Never edit `.pio/` or third-party/vendor assets.
