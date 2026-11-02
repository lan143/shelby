import { render } from 'preact';
import './styles.css';
import { App } from './App';
import 'edn-network-ui'; // registers <edn-network-status|settings|page> globally
import 'edc-config-ui'; // registers <edc-config-backup-page> globally

const root = document.getElementById('app');
if (root) {
  render(<App />, root);
}
