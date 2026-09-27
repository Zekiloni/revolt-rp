import { IEvents, NetEventHandler } from '@revolt-rp/game-abstraction';

const getEventSource = (): number => {
  return (global as unknown as { source: number }).source;
};

export const createFivemEvents = (): IEvents => ({
  on: (event, handler) => {
    on(event, handler);
  },
  emit: (event, ...args) => {
    emit(event, ...args);
  },
  onNet: (event, handler) => {
    const netHandler: NetEventHandler = handler;
    onNet(event, (...args) => {
      netHandler(getEventSource(), ...args);
    });
  },
  emitNet: (target, event, ...args) => {
    emitNet(event, target, ...args);
  }
});
