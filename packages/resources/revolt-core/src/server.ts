import { createApiClient } from '@revolt-rp/api-client';
import { createSessionStore } from '@revolt-rp/game-kernel';
import {
  createFivemEvents,
  createFivemHttpTransport,
  getConvar,
  getCurrentResourceName,
  registerResourceExport
} from '@revolt-rp/platform-fivem';

const events = createFivemEvents();
const sessions = createSessionStore();

const apiBaseUrl = getConvar('revolt_api_url', 'http://localhost:3000');
const serviceToken = getConvar('revolt_service_token', '');

if (!serviceToken) {
  console.warn('[revolt-core] convar revolt_service_token is not set — api requests will be unauthorized');
}

const api = createApiClient({
  baseUrl: apiBaseUrl,
  token: serviceToken,
  transport: createFivemHttpTransport()
});

registerResourceExport('sessionsGet', (src) => sessions.get(Number(src)));
registerResourceExport('sessionsAll', () => sessions.all());
registerResourceExport('sessionsRemove', (src) => {
  sessions.remove(Number(src));
});
registerResourceExport('apiPing', async () => {
  const status = await api.request<unknown>('GET', '/api/status');
  console.log('[revolt-core] api status:', JSON.stringify(status));
  return status;
});

events.on('onResourceStart', (resourceName) => {
  if (resourceName === getCurrentResourceName()) {
    console.log(`[revolt-core] started (api: ${apiBaseUrl}, node: ${process.version})`);
  }
});
