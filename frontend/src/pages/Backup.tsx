import { useEffect, useRef } from 'preact/hooks';

/**
 * Mounts the `edc-config-ui` backup page imperatively. The package registers
 * `<edc-config-backup-page>` once at module scope; this component only owns the
 * element's lifecycle. The element downloads and restores the archive/raw
 * config, prompts for confirmation, and polls `/healthcheck/healty` after a
 * restore reboots the device. Endpoints stay at the package defaults, which
 * match the firmware routes: /api/config/backup and /api/config.
 */
export function BackupPanel() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = document.createElement('edc-config-backup-page');
    element.setAttribute('device-name', 'Shelby');
    element.setAttribute('archive-file-name', 'shelby-config.zip');
    element.setAttribute('bin-file-name', 'config.bin');
    // Same origin by default; only set 'base-url' for a CORS-enabled device.
    host.current?.append(element);
    return () => element.remove();
  }, []);

  return <div ref={host} />;
}
