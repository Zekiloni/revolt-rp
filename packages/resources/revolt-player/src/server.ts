import {
  createFivemEvents,
  createFivemIdentity,
  getCurrentResourceName,
  registerResourceExport
} from '@revolt-rp/platform-fivem';

const events = createFivemEvents();
const identity = createFivemIdentity();

registerResourceExport('playerIdentities', (src) => identity.getIdentities(Number(src)));
registerResourceExport('playerName', (src) => identity.getName(Number(src)));

events.on('playerDropped', (...args) => {
  const reason = args[0];
  console.log(`[revolt-player] player dropped: ${String(reason ?? 'unknown reason')}`);
});

events.on('onResourceStart', (resourceName) => {
  if (resourceName === getCurrentResourceName()) {
    console.log('[revolt-player] started');
  }
});
