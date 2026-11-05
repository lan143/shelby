import { useEffect, useState } from 'preact/hooks';
import { getStatus } from './api/client';
import { TabBar, type TabItem } from './components/TabBar';
import { BackupPanel } from './pages/Backup';
import { DevicesPage } from './pages/Devices';
import { ModbusPage } from './pages/Modbus';
import { MqttSettingsPage } from './pages/MqttSettings';
import { NetworkPage } from './pages/Network';
import { StatusPage } from './pages/Status';

type TabId =
  | 'status'
  | 'devices'
  | 'modbus'
  | 'mqtt'
  | 'network'
  | 'backup';

const TABS: ReadonlyArray<TabItem<TabId>> = [
  { id: 'status', label: 'Status' },
  { id: 'devices', label: 'Devices' },
  { id: 'modbus', label: 'Modbus' },
  { id: 'mqtt', label: 'MQTT' },
  { id: 'network', label: 'Network' },
  { id: 'backup', label: 'Backup' },
];

function renderPanel(tab: TabId) {
  switch (tab) {
    case 'status':
      return <StatusPage />;
    case 'devices':
      return <DevicesPage />;
    case 'modbus':
      return <ModbusPage />;
    case 'mqtt':
      return <MqttSettingsPage />;
    case 'network':
      return <NetworkPage />;
    case 'backup':
      return <BackupPanel />;
  }
}

export function App() {
  const [tab, setTab] = useState<TabId>('status');
  const [fwVersion, setFwVersion] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    void getStatus().then((result) => {
      if (mounted && result.ok && result.data.fwVersion) {
        setFwVersion(result.data.fwVersion);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <header class="app-header">
        <div class="brand">
          <h1>Shelby</h1>
        </div>
        <div class="versions">
          <span class="hint">KC868-A2 controller</span>
          <span class="hint version">FW {fwVersion ?? '\u2014'}</span>
          <span class="hint version">UI {__UI_VERSION__}</span>
        </div>
      </header>
      <TabBar tabs={TABS} active={tab} onSelect={setTab} />
      <main
        class="tab-content"
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
      >
        {renderPanel(tab)}
      </main>
    </>
  );
}
