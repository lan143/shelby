import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { controlDevice, getDevices } from '../api/client';
import type {
  CoverSnapshot,
  DevicesSnapshot,
  SectionSnapshot,
  SensorReading,
  SwitchSnapshot,
} from '../api/types';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const POLL_INTERVAL_MS = 5_000;
// After a successful write the device settles in stages, so probe a few times.
const REFETCH_DELAYS_MS = [300, 700, 1_500] as const;

// --- formatting -------------------------------------------------------------

function coverBadge(cover: CoverSnapshot): { className: string; label: string } {
  if (!cover.available) {
    return { className: 'badge badge-danger', label: 'Unavailable' };
  }
  switch (cover.state) {
    case 'open':
      return { className: 'badge badge-on', label: 'Open' };
    case 'opening':
      return { className: 'badge badge-warning', label: 'Opening' };
    case 'closing':
      return { className: 'badge badge-warning', label: 'Closing' };
    case 'closed':
      return { className: 'badge badge-off', label: 'Closed' };
  }
}

function switchBadge(sw: SwitchSnapshot): { className: string; label: string } {
  if (!sw.available) {
    return { className: 'badge badge-danger', label: 'Unavailable' };
  }
  return sw.enabled
    ? { className: 'badge badge-on', label: 'On' }
    : { className: 'badge badge-off', label: 'Off' };
}

function formatSensorValue(sensor: SensorReading): string {
  if (typeof sensor.value === 'boolean') {
    return sensor.value ? 'Open' : 'Closed';
  }
  switch (sensor.id) {
    case 'septic_tank_filling_level':
    case 'septic_tank_filling_volume':
      return sensor.value.toFixed(2);
    case 'septic_tank_average_absorption_speed':
    case 'septic_tank_average_incoming_speed':
      return sensor.value.toFixed(1);
    default:
      return String(sensor.value);
  }
}

function findSection(
  sections: SectionSnapshot[],
  id: string,
): SectionSnapshot | undefined {
  return sections.find((section) => section.id === id);
}

// --- Access -----------------------------------------------------------------

interface CoverCardProps {
  cover: CoverSnapshot;
  busy: boolean;
  onCommand: (id: string, command: 'open' | 'close' | 'stop') => void;
}

function CoverCard({ cover, busy, onCommand }: CoverCardProps) {
  const badge = coverBadge(cover);
  const disabled = busy || !cover.available;

  return (
    <div class={`device-card${cover.available ? '' : ' is-unavailable'}`}>
      <div class="device-card-head">
        <span class="device-name">{cover.name}</span>
        <span class={badge.className}>{badge.label}</span>
      </div>
      <div class="device-actions">
        <Button
          variant="primary"
          disabled={disabled}
          onClick={() => onCommand(cover.id, 'open')}
        >
          Open
        </Button>
        <Button
          disabled={disabled}
          onClick={() => onCommand(cover.id, 'close')}
        >
          Close
        </Button>
        <Button
          disabled={disabled}
          onClick={() => onCommand(cover.id, 'stop')}
        >
          Stop
        </Button>
      </div>
    </div>
  );
}

function GatesOpenCard({ sensor }: { sensor: SensorReading }) {
  const open = sensor.available && sensor.value === true;
  const badge = !sensor.available
    ? { className: 'badge badge-danger', label: 'Unavailable' }
    : open
      ? { className: 'badge badge-on', label: 'Open' }
      : { className: 'badge badge-off', label: 'Closed' };

  return (
    <div class={`device-card${sensor.available ? '' : ' is-unavailable'}`}>
      <div class="device-card-head">
        <span class="device-name">{sensor.name}</span>
        <span class={badge.className}>{badge.label}</span>
      </div>
      <p class="device-help">
        Magnetic end-position sensor on the gate.
      </p>
    </div>
  );
}

// --- Lighting ---------------------------------------------------------------

interface SwitchCardProps {
  sw: SwitchSnapshot;
  busy: boolean;
  onToggle: (id: string, enabled: boolean) => void;
}

function SwitchCard({ sw, busy, onToggle }: SwitchCardProps) {
  const badge = switchBadge(sw);
  const disabled = busy || !sw.available;

  return (
    <div class={`device-card${sw.available ? '' : ' is-unavailable'}`}>
      <div class="device-card-head">
        <span class="device-name">{sw.name}</span>
        <span class={badge.className}>{badge.label}</span>
      </div>
      <div class="device-actions">
        <Button
          variant={sw.available && !sw.enabled ? 'primary' : 'default'}
          disabled={disabled}
          onClick={() => onToggle(sw.id, !sw.enabled)}
        >
          {sw.available ? (sw.enabled ? 'Turn off' : 'Turn on') : 'Unavailable'}
        </Button>
      </div>
      {sw.id === 'watering_the_lawn' ? (
        <p class="device-help">
          Turns off automatically after 20 minutes.
        </p>
      ) : null}
    </div>
  );
}

// --- Septic -----------------------------------------------------------------

function SensorCard({ sensor }: { sensor: SensorReading }) {
  return (
    <div class={`sensor-card${sensor.available ? '' : ' is-unavailable'}`}>
      <span class="sensor-name">{sensor.name}</span>
      {sensor.available ? (
        <span class="sensor-value">
          {formatSensorValue(sensor)}
          {sensor.unit ? <span class="sensor-unit">{sensor.unit}</span> : null}
        </span>
      ) : (
        <span class="sensor-value sensor-unavailable">&mdash;</span>
      )}
    </div>
  );
}

// --- Page -------------------------------------------------------------------

export function DevicesPage() {
  const [snapshot, setSnapshot] = useState<DevicesSnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [commandError, setCommandError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [inFlight, setInFlight] = useState<ReadonlyArray<string>>([]);
  const savingCountRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const load = useCallback(async () => {
    const result = await getDevices();
    if (result.ok) {
      setSnapshot(result.data);
      setLoadError(null);
    } else {
      setLoadError(result.message);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      if (savingCountRef.current === 0) {
        void load();
      }
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    return () => {
      for (const t of timersRef.current) {
        window.clearTimeout(t);
      }
    };
  }, []);

  const scheduleRefetch = useCallback(() => {
    for (const delayMs of REFETCH_DELAYS_MS) {
      const timer = window.setTimeout(() => {
        timersRef.current = timersRef.current.filter((t) => t !== timer);
        void load();
      }, delayMs);
      timersRef.current.push(timer);
    }
  }, [load]);

  const beginSave = useCallback((id: string) => {
    savingCountRef.current += 1;
    setInFlight((current) => (current.includes(id) ? current : [...current, id]));
  }, []);

  const endSave = useCallback((id: string) => {
    savingCountRef.current = Math.max(0, savingCountRef.current - 1);
    setInFlight((current) => current.filter((value) => value !== id));
  }, []);

  const sendCommand = useCallback(
    async (id: string, command: 'open' | 'close' | 'stop') => {
      setCommandError(null);
      beginSave(id);
      try {
        const result = await controlDevice({ id, command });
        if (result.ok) {
          scheduleRefetch();
        } else {
          setCommandError(result.message);
        }
      } catch (error) {
        setCommandError(error instanceof Error ? error.message : String(error));
      } finally {
        endSave(id);
      }
    },
    [beginSave, endSave, scheduleRefetch],
  );

  const toggleSwitch = useCallback(
    async (id: string, enabled: boolean) => {
      setCommandError(null);
      beginSave(id);
      try {
        const result = await controlDevice({ id, enabled });
        if (result.ok) {
          scheduleRefetch();
        } else {
          setCommandError(result.message);
        }
      } catch (error) {
        setCommandError(error instanceof Error ? error.message : String(error));
      } finally {
        endSave(id);
      }
    },
    [beginSave, endSave, scheduleRefetch],
  );

  if (!loaded) {
    return (
      <Card title="Devices">
        <p class="muted">Loading devices&hellip;</p>
      </Card>
    );
  }

  const sections = snapshot?.sections ?? [];
  const access = findSection(sections, 'access');
  const lighting = findSection(sections, 'lighting');
  const septic = findSection(sections, 'septic');

  return (
    <div class="stack">
      {loadError ? (
        <>
          <Banner kind="error" message={loadError} />
          <div class="form-actions">
            <Button onClick={() => void load()}>Retry</Button>
          </div>
        </>
      ) : null}

      {commandError ? (
        <Banner
          kind="error"
          message={commandError}
          onClose={() => setCommandError(null)}
        />
      ) : null}

      {access ? (
        <Card title={access.name}>
          <p class="muted">
            Gate commands are ignored unless the door mode is closed; door
            commands are ignored unless the gates are closed.
          </p>
          <div class="device-grid">
            {(access.covers ?? []).map((cover) => (
              <CoverCard
                key={cover.id}
                cover={cover}
                busy={inFlight.includes(cover.id)}
                onCommand={(id, command) => void sendCommand(id, command)}
              />
            ))}
            {(access.sensors ?? []).map((sensor) => (
              <GatesOpenCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
        </Card>
      ) : null}

      {lighting ? (
        <Card title={lighting.name}>
          <div class="device-grid">
            {(lighting.switches ?? []).map((sw) => (
              <SwitchCard
                key={sw.id}
                sw={sw}
                busy={inFlight.includes(sw.id)}
                onToggle={(id, enabled) => void toggleSwitch(id, enabled)}
              />
            ))}
          </div>
        </Card>
      ) : null}

      {septic ? (
        <Card title={septic.name}>
          <div class="sensor-grid">
            {(septic.sensors ?? []).map((sensor) => (
              <SensorCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
        </Card>
      ) : null}

      <p class="muted">
        Device values refresh automatically every 5 seconds; after a change the
        device settles within about a second.
      </p>
    </div>
  );
}
