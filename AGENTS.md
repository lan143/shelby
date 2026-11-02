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
| `src/main.cpp` | Composition root: globals, dependency wiring, `setup()`, `loop()`, legacy config migration |
| `src/defines.h` | Pin map, RS485/Ethernet constants, device identity strings |
| `src/config.h` | `Config` struct (`CURRENT_VERSION = 3`, `mqttTopicPrefix`), EEPROM-backed settings |
| `src/gates/gates.cpp/.h`, `gates_state.h` | Gate/door state machines, relay pulses, end-position sensing, cover MQTT/discovery; classes `Gates`, `GatesState` |
| `src/gates/gates_command_handler.cpp/.h` | Plain-payload cover command consumer; class `GatesCommandHandler` |
| `src/relay/relay.cpp/.h` | Native relay abstraction `Relay` (`reverse` flag) |
| `src/sensor/gates_open_sensor.cpp/.h` | MR6C input 1 as gate-open binary sensor (thin `garage_door` subclass); class `GatesOpenSensor` |
| `src/septic/septic.cpp/.h` | QDY-30A level orchestrator, volume/speed calculations, health check; class `Septic` |
| `src/septic/septic_water_level.cpp/.h` | EDCommon water-level sensor with 3.5 m rejection; class `SepticWaterLevel` |
| `src/septic/septic_derived_sensor.h` | EDCommon sensor fed by a provider callback; class `SepticDerivedSensor` |
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
| WB-MR6C | 2 | Relays 1, 4, 5, 6; inputs 0,2,3,4,6 set to frequency mode in `setup()`. Input 1 is owned by the EDCommon binary sensor, which also sets it to frequency mode. |
| QDY-30A | 1 | Holding regs `0x0002` (unit) and `0x0003` (dot position) read once at boot; level reg `0x0004` polled every 60 s |

MR6C channel map: 1 = lawn watering, 4 = decorative light, 5 = parking light, 6 = street light.

## Runtime architecture

`setup()` constructs global objects (constructor dependency injection), loads config from EEPROM (migrating a v2 blob when present), initializes SPIFFS, network, OTA, MQTT, discovery, gates, MR6C, EDCommon relays, the gates-open binary sensor, both cover command consumers, and QDY-30A. The EDCommon entities own their MQTT/discovery wiring; `main.cpp` only composes them.

`loop()` order is significant: `networkMgr.loop()`, `discoveryMgr.loop()`, `ArduinoOTA.handle()`, `gates->loop()`, `healthCheck.loop()`, `septic->update()`, `networkLogger.update()`, `gatesOpenSensor->update()`, `lawnWateringRelay->update()`, `decorativeRelay->update()`, `parkingRelay->update()`, `streetRelay->update()`.

State flow: there is no aggregate `State` any more. Each EDCommon relay/sensor/binary sensor serializes and publishes its own topic; covers are published by `Gates` directly through `EDMQTT::MQTT::publish(topic, payload, false)` on change at most every 500 ms. The gates open sensor is read by `Gates` via `isActive()`; an invalid reading is treated as closed until the first successful MR6C read.

Command flow: each controllable entity subscribes its own `.../set` topic. `GatesCommandHandler` (one instance per cover) maps plain `open`/`close`/`stop` payloads and dispatches to `Gates::gatesChange()` / `Gates::doorChange()`; EDCommon relay consumers map plain `on`/`off`. All command consumers reject retained messages.

Timing: all periodic work is non-blocking and scheduled with `esp_timer_get_time()` in microseconds. Do not add blocking `delay()` to `loop()` or module updates.

Network: Ethernet is started first (`hasEth=true`); after repeated connection failures it falls back to Wi-Fi client mode (if `isAPMode=false`) and then to SoftAP. In AP mode the device serves the UI at `http://192.168.4.1/`. Network connect/disconnect callbacks enable/disable the remote logger and connect/disconnect MQTT.

## MQTT contract

Every entity has its own state and command topic derived from `mqttTopicPrefix` (default `shelby/<chipID>`, set in `configMgr.setDefault()`). The default HA discovery prefix is `homeassistant` and the broker port is `1883`.

| Entity | State topic | State payload | Retained |
|---|---|---|---|
| Gates (cover) | `{prefix}/gates/state` | `closed`, `opening`, `closing`, `open` | no |
| Gates door mode (cover) | `{prefix}/door/state` | `closed`, `opening`, `closing`, `open` | no |
| Gates open (binary sensor) | `{prefix}/gates_open/state` | `true`, `false` | yes |
| Watering the lawn (switch) | `{prefix}/watering_the_lawn/state` | `{"enabled":"on"}` / `{"enabled":"off"}` | no |
| Decorative light (switch) | `{prefix}/decorative_light/state` | `{"enabled":"on"}` / `{"enabled":"off"}` | no |
| Parking space light (switch) | `{prefix}/parking_space_light/state` | `{"enabled":"on"}` / `{"enabled":"off"}` | no |
| Street light (switch) | `{prefix}/street_light/state` | `{"enabled":"on"}` / `{"enabled":"off"}` | no |
| Septic tank filling level (sensor) | `{prefix}/septic_tank_filling_level/state` | plain number, m | yes |
| Septic tank filling volume (sensor) | `{prefix}/septic_tank_filling_volume/state` | plain number, m³ | yes |
| Septic tank average absorption speed (sensor) | `{prefix}/septic_tank_average_absorption_speed/state` | plain number, L/h | yes |
| Septic tank average incoming speed (sensor) | `{prefix}/septic_tank_average_incoming_speed/state` | plain number, L/h | yes |

The gates-open state is absent until the first valid MR6C reading. Command topics and payloads:

| Entity | Command topic | Payload |
|---|---|---|
| Gates | `{prefix}/gates/set` | `open`, `close`, `stop`; anything else maps to stop |
| Gates door mode | `{prefix}/door/set` | `open`, `close`, `stop`; anything else maps to stop |
| Watering the lawn | `{prefix}/watering_the_lawn/set` | `on`, `off` |
| Decorative light | `{prefix}/decorative_light/set` | `on`, `off` |
| Parking space light | `{prefix}/parking_space_light/set` | `on`, `off` |
| Street light | `{prefix}/street_light/set` | `on`, `off` |

All command consumers reject retained messages. Cover state is published on change at most every 500 ms; EDCommon relays publish state on change and refresh it every 60 s; sensors and the binary sensor publish on change and refresh every 60 s. Discovery configs are published retained.

HA discovery entities:

| Name | Type | unique_id | Value template |
|---|---|---|---|
| Gates | cover, class `gate` | `gates_cover_shelby` | none (native cover states) |
| Gates door mode | cover, class `door` | `gates_door_mode_cover_shelby` | none (native cover states) |
| Gates open | binary_sensor, class `garage_door` | `gates_open_shelby_<chipID>` | `{{ value }}` |
| Watering the lawn | switch | `watering_the_lawn_shelby_<chipID>` | `{{ value_json.enabled }}` |
| Decorative light | switch | `decorative_light_shelby_<chipID>` | `{{ value_json.enabled }}` |
| Parking space light | switch | `parking_space_light_shelby_<chipID>` | `{{ value_json.enabled }}` |
| Street light | switch | `street_light_shelby_<chipID>` | `{{ value_json.enabled }}` |
| Septic tank filling level | sensor, m | `septic_tank_filling_level_shelby_<chipID>` | `{{ value }}` |
| Septic tank filling volume | sensor, m³, `volume_storage` | `septic_tank_filling_volume_shelby_<chipID>` | `{{ value }}` |
| Septic tank average absorption speed | sensor, L/h, `volume_flow_rate` | `septic_tank_average_absorption_speed_shelby_<chipID>` | `{{ value }}` |
| Septic tank average incoming speed | sensor, L/h, `volume_flow_rate` | `septic_tank_average_incoming_speed_shelby_<chipID>` | `{{ value }}` |

The covers keep their legacy unique IDs so Home Assistant reuses the existing entities. Every other entity is created by EDCommon with unique ID `{object_id}_shelby_<chipID>`. Volume and speed sensors are created only when `septicDiameter != 0`.

## Domain invariants — do not break

- Gate commands are ignored unless the door is `CLOSED`; door commands are ignored unless the gates are `CLOSED`.
- `skipCommand` matrix: `OPEN` only from `CLOSED`; `CLOSE` only from `OPENED`; `STOP` only from `OPENING`/`CLOSING`.
- `STOP` resolves to `OPENED`, not an unknown state.
- Native gate/door relays are momentary pulses: ON, then OFF after 0.2 s (200000 µs).
- End signals are sampled every 1 ms into counters constrained to 0..50; motor movement is detected above 25.
- Motor transitions are evaluated every 0.5 s; opening while both are closed enters `OPENING`, end of opening with `isGatesOpen` enters `OPENED`, closing from `OPENED` enters `CLOSING`, end of motion sets both `CLOSED`.
- The gate-end signals are `GATE_OPEN`/`GATE_CLOSE`; the open sensor is MR6C input 1, now owned by `EDCommon::BinarySensor::WBMR6C` (FREQUENCY mode, `reverse=true`). There is no relay-module init-order dependency any more.
- Lawn watering turns off automatically after 20 minutes (`1200000000` µs) through EDCommon's `Relay::withTimeout()`. Relays 4, 5 and 6 are fire-and-forget.
- QDY-30A is polled every 60 s; readings above 3.5 m are rejected; speeds are only calculated below 2.8 m; speeds use 10-sample ring buffers and reset to 0 after 5 minutes without updates; the sensor is "not ready" after 10 minutes without a valid reading.
- Cover and relay state is non-retained; sensor and binary-sensor state is retained; discovery is retained.
- A config schema change requires bumping `CURRENT_VERSION` in `src/config.h`; v2 EEPROM blobs are migrated in `src/main.cpp`.

## Conventions

- C++ style: 4-space indentation, Allman braces, `_camelCase` private members, `PascalCase` classes, one class per `.h`/`.cpp` pair under `src/<module>/`.
- Logging: `LOGx(tag, msg)` macros from `ed-utils`.
- Dependency wiring lives in `src/main.cpp` only; modules receive collaborators via constructors.
- Adding an HA entity: add it in the owning module's `init()` and give it its own state/command topics (EDCommon `withMQTT`/`withDiscovery`, or `Gates`-style direct publishing); update the MQTT contract above.
- Adding a config field: update `src/config.h`, defaults in `configMgr.setDefault()` (`src/main.cpp`), the relevant `/api/settings*` GET/POST handler, the UI form in `data/index.html`/`index.js`, and bump `CURRENT_VERSION`.
- EDCommon uses millisecond update intervals for sensors/binary sensors (`init()` multiplies by 1000) but microseconds for relay timeouts and scheduling; do not mix the units.
- Never write real WiFi, MQTT or OTA credentials into docs, tests or commits; use placeholders such as `<password>`.

## Gotchas & risks

- `src/web/handler.cpp` includes `"Handler.h"` (capital H) while the file is `handler.h`. It compiles on case-insensitive macOS but breaks on case-sensitive filesystems. Do not silently rename or "fix" it; flag it.
- The OTA password is hardcoded twice (`ArduinoOTA::setPassword()` in `src/main.cpp` and `--auth=` in `platformio.ini`). The remote logger host/port/URI are also hardcoded in `src/main.cpp` with a `@todo: move to config`. Never copy the actual secret values into documentation.
- The web API has no authentication; WiFi/MQTT credentials are stored as plaintext in EEPROM. Use only on a trusted, isolated LAN. The default AP has no password (`wifiAPHasPassword=false`).
- `/healthcheck/healty` is a real typo in the `ed-healthcheck` library, not app code. `/healthcheck/ready` is also exposed.
- `GET /api/wifi/list` exists but its body is fully commented out; it is non-functional.
- `STOP` sets `OPENED`; do not assume `unknown`.
- Lawn watering auto-off is intentional; do not remove it as a "stuck relay" bug.
- Cover/relay state is non-retained while sensor/binary-sensor state and discovery are retained; do not flip these without checking HA entity availability.
- Do not edit `.pio/` or minified vendor assets; do not reformat vendored libraries.

## Never do

- Never commit or document real WiFi/MQTT/OTA secrets.
- Never add blocking `delay()` calls to `loop()` or module update paths.
- Never silently "fix" the `Handler.h` include case; flag it in the change/report.
- Never change MQTT topic slugs, payload formats or the config schema without updating HA templates/discovery, the web UI, docs and `CURRENT_VERSION`.
- Never edit `.pio/` or third-party/vendor assets.
