import type {
  DeviceSetPayload,
  DeviceStatus,
  DevicesSnapshot,
  EmptyObject,
  HealthResponse,
  ModbusPayload,
  MqttPayload,
  ReadyResponse,
  SepticPayload,
} from './types';

/**
 * Client-side safety limits derived from the firmware contract.
 *
 * The firmware `strcpy`s into fixed char buffers, only accepts a fixed Modbus
 * speed enum, and rejects out-of-range values with HTTP 422, so pages must
 * enforce the same (or stricter) caps before a request is sent. String caps
 * mirror the `*_LEN - 1` checks in `src/web/handler.cpp` and the ed-mqtt
 * headers (`HOST_LEN`/`MQTT_TOPIC_LEN` = 64, `MQTT_LOGIN_LEN`/
 * `MQTT_PASSWORD_LEN` = 32).
 */
export const LIMITS = {
  mqtt: {
    /** `host[64]` (HOST_LEN 64); must be non-empty. */
    hostMin: 1,
    hostMax: 63,
    portMin: 1,
    portMax: 65535,
    /** `login[32]` / `password[32]`; may be empty but must be present. */
    loginMax: 31,
    passwordMax: 31,
    /** `mqttHADiscoveryPrefix[64]` (MQTT_TOPIC_LEN 64); must be non-empty. */
    haDiscoveryPrefixMin: 1,
    haDiscoveryPrefixMax: 63,
    /** Global `mqttTopicPrefix[64]` (MQTT_TOPIC_LEN 64); 1..63 chars. */
    topicPrefixMin: 1,
    topicPrefixMax: 63,
  },
  modbus: {
    /** The only speeds the firmware switch statement accepts. */
    speeds: [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200],
    addressMin: 1,
    addressMax: 254,
  },
  septic: {
    /** The UI caps the diameter at 5 m; the firmware only rejects negatives. */
    diameterMin: 0,
    diameterMax: 5,
    diameterStep: 0.1,
  },
} as const;

/** Covers accept open/close/stop; switches accept enabled. */
export const COVER_IDS = ['gates', 'door'] as const;
export const SWITCH_IDS = [
  'watering_the_lawn',
  'decorative_light',
  'parking_space_light',
  'street_light',
] as const;
export const COVER_COMMANDS = ['open', 'close', 'stop'] as const;

/** Failure side of every API call. */
export interface ApiFailure {
  ok: false;
  /** HTTP status when a response was received; absent for network failures. */
  status?: number;
  message: string;
}

/** Result of every API call. */
export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

/** Result of a mutating call; the device replies `{}` on success. */
export type ActionResult = ApiResult<EmptyObject>;

const EMPTY_CONFIG_MESSAGE =
  'Device returned an empty response. Check the device logs and try again.';
const EMPTY_BODY_MESSAGE = 'Device returned an empty response.';
const NETWORK_MESSAGE =
  'Could not reach the device. Check that you are connected to its network and try again.';

const EMPTY_OBJECT: EmptyObject = {};

function networkFailure(): ApiFailure {
  return { ok: false, message: NETWORK_MESSAGE };
}

function messageFromBody(text: string): string | undefined {
  try {
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && 'message' in parsed) {
      const value = (parsed as { message?: unknown }).message;
      if (typeof value === 'string' && value) {
        return value;
      }
    }
  } catch {
    // Not JSON; caller falls back to a generic message.
  }
  return undefined;
}

async function failureFromResponse(res: Response): Promise<ApiFailure> {
  let message = `Request failed (HTTP ${res.status}).`;
  try {
    const text = await res.text();
    if (text) {
      message = messageFromBody(text) ?? message;
    }
  } catch {
    // Keep the generic message.
  }
  return { ok: false, status: res.status, message };
}

/** GET a JSON endpoint. `emptyMessage` is used for empty/unparseable 200s. */
async function getJson<T>(
  path: string,
  emptyMessage: string,
): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(path, { headers: { Accept: 'application/json' } });
  } catch {
    return networkFailure();
  }

  if (!res.ok) {
    return failureFromResponse(res);
  }

  let text: string;
  try {
    text = await res.text();
  } catch {
    return { ok: false, status: res.status, message: NETWORK_MESSAGE };
  }

  if (!text.trim()) {
    return { ok: false, status: res.status, message: emptyMessage };
  }

  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return { ok: false, status: res.status, message: emptyMessage };
  }
}

/** Send a mutating request; a 200 is success even with an empty body. */
async function send(path: string, init: RequestInit): Promise<ActionResult> {
  let res: Response;
  try {
    res = await fetch(path, init);
  } catch {
    return networkFailure();
  }

  if (!res.ok) {
    return failureFromResponse(res);
  }

  let text = '';
  try {
    text = await res.text();
  } catch {
    return { ok: true, data: EMPTY_OBJECT };
  }

  if (!text.trim()) {
    return { ok: true, data: EMPTY_OBJECT };
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    return {
      ok: true,
      data:
        parsed && typeof parsed === 'object'
          ? (parsed as EmptyObject)
          : EMPTY_OBJECT,
    };
  } catch {
    return { ok: true, data: EMPTY_OBJECT };
  }
}

function sendForm(path: string, body: URLSearchParams): Promise<ActionResult> {
  return send(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: body.toString(),
  });
}

// --- runtime guards ---------------------------------------------------------
// These throw before a request can reach the device with a payload that would
// overflow a firmware buffer or be rejected with HTTP 422.

function requireString(
  value: unknown,
  field: string,
  max: number,
  allowEmpty = false,
): string {
  if (typeof value !== 'string') {
    throw new Error(`${field} is required.`);
  }
  if (!allowEmpty && value.length === 0) {
    throw new Error(`${field} must not be empty.`);
  }
  if (value.length > max) {
    throw new Error(`${field} must be at most ${max} characters.`);
  }
  return value;
}

function requireNumber(
  value: unknown,
  field: string,
  min: number,
  max: number,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${field} must be a number.`);
  }
  if (value < min || value > max) {
    throw new Error(`${field} must be between ${min} and ${max}.`);
  }
  return value;
}

function requireEnum<T extends string | number>(
  value: unknown,
  field: string,
  allowed: readonly T[],
): T {
  if (!allowed.includes(value as T)) {
    throw new Error(`${field} must be one of: ${allowed.join(', ')}.`);
  }
  return value as T;
}

// --- reads ------------------------------------------------------------------

/** GET /api/status */
export function getStatus(): Promise<ApiResult<DeviceStatus>> {
  return getJson<DeviceStatus>('/api/status', EMPTY_BODY_MESSAGE);
}

/** GET /healthcheck/healty (misspelled path and key intentionally). */
export function getHealth(): Promise<ApiResult<HealthResponse>> {
  return getJson<HealthResponse>('/healthcheck/healty', EMPTY_BODY_MESSAGE);
}

/**
 * GET /healthcheck/ready. Returns HTTP 500 with `{ready:false,message}` while
 * the device is not ready; that surfaces here as `ok:false` with the reason.
 */
export function getReady(): Promise<ApiResult<ReadyResponse>> {
  return getJson<ReadyResponse>('/healthcheck/ready', EMPTY_BODY_MESSAGE);
}

/** GET /api/devices (cached section snapshot, refresh every ~5 s). */
export function getDevices(): Promise<ApiResult<DevicesSnapshot>> {
  return getJson<DevicesSnapshot>('/api/devices', EMPTY_BODY_MESSAGE);
}

/** GET /api/settings/modbus */
export function getModbusSettings(): Promise<ApiResult<ModbusPayload>> {
  return getJson<ModbusPayload>('/api/settings/modbus', EMPTY_CONFIG_MESSAGE);
}

/** GET /api/settings (septic tank). */
export function getSepticSettings(): Promise<ApiResult<SepticPayload>> {
  return getJson<SepticPayload>('/api/settings', EMPTY_CONFIG_MESSAGE);
}

/** GET /api/settings/mqtt */
export function getMqttSettings(): Promise<ApiResult<MqttPayload>> {
  return getJson<MqttPayload>('/api/settings/mqtt', EMPTY_CONFIG_MESSAGE);
}

// --- writes -----------------------------------------------------------------

/**
 * POST /api/settings/modbus — all three fields are required. The speed applies
 * live after save; the two addresses need a reboot.
 */
export function postModbusSettings(
  payload: ModbusPayload,
): Promise<ActionResult> {
  const modbusSpeed = requireEnum(
    payload.modbusSpeed,
    'Modbus speed',
    LIMITS.modbus.speeds,
  );
  const addressMR6C = requireNumber(
    payload.addressMR6C,
    'WB-MR6C address',
    LIMITS.modbus.addressMin,
    LIMITS.modbus.addressMax,
  );
  const addressQDY30A = requireNumber(
    payload.addressQDY30A,
    'QDY-30A address',
    LIMITS.modbus.addressMin,
    LIMITS.modbus.addressMax,
  );

  const body = new URLSearchParams();
  body.set('modbusSpeed', String(modbusSpeed));
  body.set('addressMR6C', String(addressMR6C));
  body.set('addressQDY30A', String(addressQDY30A));
  return sendForm('/api/settings/modbus', body);
}

/** POST /api/settings (septic tank diameter, metres; 0 disables sensors). */
export function postSepticSettings(
  payload: SepticPayload,
): Promise<ActionResult> {
  const septicDiameter = requireNumber(
    payload.septicDiameter,
    'Septic tank diameter',
    LIMITS.septic.diameterMin,
    LIMITS.septic.diameterMax,
  );

  const body = new URLSearchParams();
  body.set('septicDiameter', String(septicDiameter));
  return sendForm('/api/settings', body);
}

/**
 * POST /api/settings/mqtt — applies after reboot.
 *
 * Always sends all seven fields required by the firmware, including
 * `mqttIsHADiscovery` as a literal "true"/"false" and the global
 * `mqttTopicPrefix`.
 */
export function postMqttSettings(payload: MqttPayload): Promise<ActionResult> {
  const host = requireString(payload.host, 'MQTT host', LIMITS.mqtt.hostMax);
  const port = requireNumber(
    payload.port,
    'MQTT port',
    LIMITS.mqtt.portMin,
    LIMITS.mqtt.portMax,
  );
  const login = requireString(
    payload.login,
    'MQTT login',
    LIMITS.mqtt.loginMax,
    true,
  );
  const password = requireString(
    payload.password,
    'MQTT password',
    LIMITS.mqtt.passwordMax,
    true,
  );
  const haDiscoveryPrefix = requireString(
    payload.haDiscoveryPrefix,
    'HA discovery prefix',
    LIMITS.mqtt.haDiscoveryPrefixMax,
  );
  const mqttTopicPrefix = requireString(
    payload.mqttTopicPrefix,
    'MQTT topic prefix',
    LIMITS.mqtt.topicPrefixMax,
  );
  if (
    mqttTopicPrefix.startsWith('/') ||
    mqttTopicPrefix.endsWith('/') ||
    mqttTopicPrefix.includes(' ')
  ) {
    throw new Error(
      'MQTT topic prefix must not start or end with "/" or contain spaces.',
    );
  }

  const body = new URLSearchParams();
  body.set('host', host);
  body.set('port', String(port));
  body.set('login', login);
  body.set('password', password);
  body.set('haDiscoveryPrefix', haDiscoveryPrefix);
  body.set('mqttIsHADiscovery', payload.mqttIsHADiscovery ? 'true' : 'false');
  body.set('mqttTopicPrefix', mqttTopicPrefix);
  return sendForm('/api/settings/mqtt', body);
}

/**
 * POST /api/devices/set — applies immediately (queued and drained by the
 * gates/relay update loops).
 *
 * Covers take `command` (open/close/stop); switches take `enabled` (sent as
 * "on"/"off"). The firmware rejects extra fields and unknown ids with 422.
 */
export function controlDevice(payload: DeviceSetPayload): Promise<ActionResult> {
  const id = requireString(payload.id, 'Device', 63);

  const body = new URLSearchParams();
  body.set('id', id);

  if ((COVER_IDS as readonly string[]).includes(id)) {
    if (payload.enabled !== undefined) {
      throw new Error('Covers accept a command, not enabled.');
    }
    if (payload.command === undefined) {
      throw new Error('Choose open, close or stop.');
    }
    const command = requireEnum(
      payload.command,
      'Command',
      COVER_COMMANDS,
    );
    body.set('command', command);
  } else if ((SWITCH_IDS as readonly string[]).includes(id)) {
    if (payload.command !== undefined) {
      throw new Error('Switches accept enabled, not a command.');
    }
    if (typeof payload.enabled !== 'boolean') {
      throw new Error('Enabled must be true or false.');
    }
    body.set('enabled', payload.enabled ? 'on' : 'off');
  } else {
    throw new Error('Unknown device id.');
  }

  return sendForm('/api/devices/set', body);
}

/** POST /api/reboot — the device replies `{}` then restarts. */
export function reboot(): Promise<ActionResult> {
  return send('/api/reboot', { method: 'POST' });
}

// --- short aliases ----------------------------------------------------------
// Pages use the descriptive *Settings names above; these aliases keep the
// surface compact for callers that only need one operation per resource.

export const getModbus = getModbusSettings;
export const setModbus = postModbusSettings;
export const getSeptic = getSepticSettings;
export const setSeptic = postSepticSettings;
export const getMqtt = getMqttSettings;
export const setMqtt = postMqttSettings;
