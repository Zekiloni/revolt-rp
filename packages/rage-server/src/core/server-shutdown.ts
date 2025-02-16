import { logger } from './logger.config';

const serverExitLogger = logger('server-exit');

async function serverExistHandler(type?: 'mp') {
  if (type === 'mp') {
    mp.events.delayShutdown = true;
  }

  const kickPromises = mp.players.toArray().map((player) =>
    new Promise((resolve) => {
      player.kick('Server is shutting down');
      setTimeout(resolve, 100);
    })
  );

  await Promise.all(kickPromises);

  if (type === 'mp') {
    mp.events.delayShutdown = false;
  }

  serverExitLogger.log('info', 'Server is shutting down');
}


mp.events.add('serverShutdown', () => serverExistHandler('mp'));
process.on('SIGINT', serverExistHandler);
process.on('SIGQUIT', serverExistHandler);
process.on('SIGTERM', serverExistHandler);
process.on('SIGHUP', serverExistHandler);
if (process.platform === 'win32') {
  process.on('SIGKILL', serverExistHandler);
}
