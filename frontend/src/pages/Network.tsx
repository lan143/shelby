import { useEffect, useRef } from 'preact/hooks';

/**
 * Mounts the `edn-network-ui` page imperatively. The package is imported once
 * in `main.tsx`; this component only owns the element's lifecycle. The firmware
 * registers the `/api/network/*` and `/api/wifi/list` routes this element talks
 * to.
 */
export function NetworkPage() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = document.createElement('edn-network-page');
    element.setAttribute('poll-interval-ms', '5000');
    // Same origin by default; use element.setAttribute('base-url', 'http://<device>')
    // to point at another ed-network device (needs CORS on that device).
    host.current?.append(element);
    return () => element.remove();
  }, []);

  return <div ref={host} />;
}
