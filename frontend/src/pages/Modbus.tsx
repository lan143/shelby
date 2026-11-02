import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import {
  getModbusSettings,
  getSepticSettings,
  postModbusSettings,
  postSepticSettings,
  reboot,
  LIMITS,
} from '../api/client';
import { Banner } from '../components/Banner';
import { Button, DangerButton } from '../components/Button';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { NeedsRebootNotice } from '../components/NeedsRebootNotice';
import { RebootOverlay, useRebootFlow } from '../components/RebootFlow';
import { Select, type SelectOption } from '../components/Select';

// --- Modbus bus -------------------------------------------------------------

interface ModbusForm {
  modbusSpeed: string;
  addressMR6C: string;
  addressQDY30A: string;
}

interface ModbusErrors {
  addressMR6C?: string;
  addressQDY30A?: string;
}

const EMPTY_MODBUS: ModbusForm = {
  modbusSpeed: '9600',
  addressMR6C: '',
  addressQDY30A: '',
};

// --- Septic tank ------------------------------------------------------------

interface SepticForm {
  septicDiameter: string;
}

interface SepticErrors {
  septicDiameter?: string;
}

const EMPTY_SEPTIC: SepticForm = {
  septicDiameter: '0',
};

function parseNumber(raw: string): number | null {
  if (raw.trim() === '') {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function hasErrors(errors: object): boolean {
  return Object.values(errors).some((message) => Boolean(message));
}

function speedOptions(current: string): SelectOption[] {
  const options: SelectOption[] = LIMITS.modbus.speeds.map((speed) => ({
    value: String(speed),
    label: `${speed} baud`,
  }));
  const value = parseNumber(current);
  if (
    value !== null &&
    !(LIMITS.modbus.speeds as readonly number[]).includes(value)
  ) {
    options.unshift({ value: current, label: `${current} (current)` });
  }
  return options;
}

function validateAddress(raw: string, label: string): string | undefined {
  const value = parseNumber(raw);
  if (
    value === null ||
    !Number.isInteger(value) ||
    value < LIMITS.modbus.addressMin ||
    value > LIMITS.modbus.addressMax
  ) {
    return `${label} must be an integer between ${LIMITS.modbus.addressMin} and ${LIMITS.modbus.addressMax}.`;
  }
  return undefined;
}

function validateDiameter(raw: string): string | undefined {
  const value = parseNumber(raw);
  if (
    value === null ||
    value < LIMITS.septic.diameterMin ||
    value > LIMITS.septic.diameterMax
  ) {
    return `Diameter must be between ${LIMITS.septic.diameterMin} and ${LIMITS.septic.diameterMax} m.`;
  }
  return undefined;
}

export function ModbusPage() {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modbus, setModbus] = useState<ModbusForm>(EMPTY_MODBUS);
  const [modbusErrors, setModbusErrors] = useState<ModbusErrors>({});

  const [septic, setSeptic] = useState<SepticForm>(EMPTY_SEPTIC);
  const [septicErrors, setSepticErrors] = useState<SepticErrors>({});

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [needsReboot, setNeedsReboot] = useState(false);
  const [rebootError, setRebootError] = useState<string | null>(null);
  const [rebooting, setRebooting] = useState(false);
  const rebootFlow = useRebootFlow();

  const options = useMemo(
    () => speedOptions(modbus.modbusSpeed),
    [modbus.modbusSpeed],
  );

  const load = useCallback(async () => {
    setLoadError(null);
    const [modbusResult, septicResult] = await Promise.all([
      getModbusSettings(),
      getSepticSettings(),
    ]);

    if (modbusResult.ok) {
      setModbus({
        modbusSpeed: String(modbusResult.data.modbusSpeed),
        addressMR6C: String(modbusResult.data.addressMR6C),
        addressQDY30A: String(modbusResult.data.addressQDY30A),
      });
    } else {
      setLoadError(modbusResult.message);
    }

    if (septicResult.ok) {
      setSeptic({
        septicDiameter: String(septicResult.data.septicDiameter),
      });
    } else {
      setLoadError((current) => current ?? septicResult.message);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateModbus = (patch: Partial<ModbusForm>) =>
    setModbus((current) => ({ ...current, ...patch }));
  const updateSeptic = (patch: Partial<SepticForm>) =>
    setSeptic((current) => ({ ...current, ...patch }));

  const beginSave = () => {
    setSaving(true);
    setNotice(null);
    setSaveError(null);
    setRebootError(null);
  };
  const finishSave = () => setSaving(false);

  const handleModbusSubmit = useCallback(
    async (event: Event) => {
      event.preventDefault();
      const nextErrors: ModbusErrors = {
        addressMR6C: validateAddress(modbus.addressMR6C, 'WB-MR6C address'),
        addressQDY30A: validateAddress(modbus.addressQDY30A, 'QDY-30A address'),
      };
      setModbusErrors(nextErrors);
      if (hasErrors(nextErrors)) {
        return;
      }

      beginSave();
      try {
        const result = await postModbusSettings({
          modbusSpeed: Number(modbus.modbusSpeed),
          addressMR6C: Number(modbus.addressMR6C),
          addressQDY30A: Number(modbus.addressQDY30A),
        });
        if (result.ok) {
          setNotice('Modbus settings saved to flash.');
          setNeedsReboot(true);
        } else {
          setSaveError(result.message);
        }
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : String(error));
      } finally {
        finishSave();
      }
    },
    [modbus],
  );

  const handleSepticSubmit = useCallback(
    async (event: Event) => {
      event.preventDefault();
      const nextErrors: SepticErrors = {
        septicDiameter: validateDiameter(septic.septicDiameter),
      };
      setSepticErrors(nextErrors);
      if (hasErrors(nextErrors)) {
        return;
      }

      beginSave();
      try {
        const result = await postSepticSettings({
          septicDiameter: Number(septic.septicDiameter),
        });
        if (result.ok) {
          setNotice('Septic tank settings saved to flash.');
          setNeedsReboot(true);
        } else {
          setSaveError(result.message);
        }
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : String(error));
      } finally {
        finishSave();
      }
    },
    [septic],
  );

  const handleReboot = useCallback(async () => {
    const confirmed = window.confirm(
      'Reboot the device now? Automation and MQTT reporting will be offline for about 20-60 seconds.',
    );
    if (!confirmed) {
      return;
    }
    setRebootError(null);
    setRebooting(true);
    const result = await reboot();
    setRebooting(false);
    if (result.ok) {
      rebootFlow.start();
    } else {
      setRebootError(result.message);
    }
  }, [rebootFlow.start]);

  if (!loaded) {
    return (
      <Card title="Modbus">
        <p class="muted">Loading Modbus settings&hellip;</p>
      </Card>
    );
  }

  return (
    <div class="stack">
      <NeedsRebootNotice />

      {loadError ? (
        <>
          <Banner kind="error" message={loadError} />
          <div class="form-actions">
            <Button onClick={() => void load()}>Retry</Button>
          </div>
        </>
      ) : null}

      <Card title="Modbus">
        {/* novalidate: JS validators own error rendering; native constraint validation would silently block submit. */}
        <form onSubmit={handleModbusSubmit} novalidate>
          <Select
            label="Bus speed"
            value={modbus.modbusSpeed}
            options={options}
            onChange={(value) => updateModbus({ modbusSpeed: value })}
            help="Applies immediately after save. Only the speeds supported by the firmware are listed."
            disabled={saving}
          />
          <Field
            label="WB-MR6C address"
            value={modbus.addressMR6C}
            onInput={(value) => updateModbus({ addressMR6C: value })}
            type="number"
            min={LIMITS.modbus.addressMin}
            max={LIMITS.modbus.addressMax}
            inputMode="numeric"
            error={modbusErrors.addressMR6C}
            help="Relay module on the shared bus. Requires a reboot to take effect."
            disabled={saving}
          />
          <Field
            label="QDY-30A address"
            value={modbus.addressQDY30A}
            onInput={(value) => updateModbus({ addressQDY30A: value })}
            type="number"
            min={LIMITS.modbus.addressMin}
            max={LIMITS.modbus.addressMax}
            inputMode="numeric"
            error={modbusErrors.addressQDY30A}
            help="Septic tank level sensor. Requires a reboot to take effect."
            disabled={saving}
          />
          <div class="form-actions">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving\u2026' : 'Save Modbus'}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Septic tank">
        {/* novalidate: JS validators own error rendering. */}
        <form onSubmit={handleSepticSubmit} novalidate>
          <Field
            label="Tank diameter"
            value={septic.septicDiameter}
            onInput={(value) => updateSeptic({ septicDiameter: value })}
            type="number"
            min={LIMITS.septic.diameterMin}
            max={LIMITS.septic.diameterMax}
            step={LIMITS.septic.diameterStep}
            inputMode="decimal"
            error={septicErrors.septicDiameter}
            help="Metres. 0 disables the volume and speed sensors. Requires a reboot to take effect."
            disabled={saving}
          />
          <div class="form-actions">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving\u2026' : 'Save septic tank'}
            </Button>
          </div>
        </form>
      </Card>

      {notice ? (
        <Banner kind="success" message={notice} onClose={() => setNotice(null)} />
      ) : null}
      {saveError ? (
        <Banner
          kind="error"
          message={saveError}
          onClose={() => setSaveError(null)}
        />
      ) : null}

      <Card title="Reboot">
        <p class="muted">
          Modbus addresses and the septic tank diameter are read during startup,
          so they apply only after a reboot.
          {needsReboot ? ' Settings saved \u2014 reboot to apply them.' : ''}
        </p>
        {rebootError ? (
          <Banner
            kind="error"
            message={rebootError}
            onClose={() => setRebootError(null)}
          />
        ) : null}
        <div class="form-actions">
          <DangerButton
            onClick={() => void handleReboot()}
            disabled={rebooting || rebootFlow.phase !== 'idle'}
          >
            Reboot device
          </DangerButton>
        </div>
      </Card>

      <RebootOverlay flow={rebootFlow} />
    </div>
  );
}
