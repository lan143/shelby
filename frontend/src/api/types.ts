/**
 * Response and request shapes for the Shelby device HTTP API.
 *
 * These mirror the firmware contracts in `src/web/handler.cpp` and the config
 * struct in `src/config.h`. GET response interfaces match the JSON the device
 * actually emits; request payload interfaces are the fields the POST handlers
 * read from a form-urlencoded body.
 */

/** GET /api/status. `uptime` is seconds since boot. */
export interface DeviceStatus {
  wifiStatus: 'connected' | 'disconnected';
  freeHeap: number;
  uptime: number;
  lastResetReason: string;
}

/** GET /healthcheck/healty (misspelled intentionally by the firmware lib). */
export interface HealthResponse {
  healty: boolean;
}

/** GET /healthcheck/ready. */
export interface ReadyResponse {
  ready: boolean;
  message: string;
}

/** One read-only sensor reading in GET /api/devices. */
export interface SensorReading {
  id: string;
  name: string;
  unit: string;
  /** Number for analogue sensors, boolean for binary inputs. */
  value: number | boolean;
  available: boolean;
}

/** One gate/door cover in GET /api/devices (`sections[].covers[]`). */
export interface CoverSnapshot {
  id: string;
  name: string;
  state: 'closed' | 'opening' | 'closing' | 'open';
  available: boolean;
}

/** One on/off relay in GET /api/devices (`sections[].switches[]`). */
export interface SwitchSnapshot {
  id: string;
  name: string;
  enabled: boolean;
  available: boolean;
}

/**
 * One section in GET /api/devices. The firmware only emits the arrays a
 * section owns: `access` has covers and sensors, `lighting` has switches,
 * `septic` has sensors.
 */
export interface SectionSnapshot {
  id: string;
  name: string;
  covers?: CoverSnapshot[];
  sensors?: SensorReading[];
  switches?: SwitchSnapshot[];
}

/** GET /api/devices payload. */
export interface DevicesSnapshot {
  sections: SectionSnapshot[];
}

/**
 * GET /api/settings/modbus and POST /api/settings/modbus.
 *
 * The POST requires all three fields. `modbusSpeed` must be one of the
 * firmware's supported baud rates and both addresses must be 1..254.
 */
export interface ModbusPayload {
  modbusSpeed: number;
  addressMR6C: number;
  addressQDY30A: number;
}

/**
 * GET /api/settings and POST /api/settings.
 *
 * `septicDiameter` is a float in metres; 0 disables the volume/speed sensors.
 */
export interface SepticPayload {
  septicDiameter: number;
}

/**
 * GET /api/settings/mqtt and POST /api/settings/mqtt.
 *
 * The POST requires all seven fields, including `mqttIsHADiscovery` sent as a
 * literal "true"/"false" (the firmware compares the string to "true").
 */
export interface MqttPayload {
  host: string;
  port: number;
  login: string;
  password: string;
  haDiscoveryPrefix: string;
  mqttIsHADiscovery: boolean;
  mqttTopicPrefix: string;
}

/**
 * POST /api/devices/set.
 *
 * `id` is required. Covers (`gates`, `door`) take `command`; switches
 * (`watering_the_lawn`, `decorative_light`, `parking_space_light`,
 * `street_light`) take `enabled`, transmitted as "on"/"off".
 */
export interface DeviceSetPayload {
  id: string;
  command?: 'open' | 'close' | 'stop';
  enabled?: boolean;
}

/** Successful response data for mutating endpoints (the device replies `{}`). */
export type EmptyObject = Record<string, never>;
