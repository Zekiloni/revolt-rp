import { ITick, TickHandler, TickUnsubscribe } from '@revolt-rp/game-abstraction';

export const createFivemTick = (): ITick => ({
  add: (handler: TickHandler): TickUnsubscribe => {
    const tickId = setTick(handler);
    return () => clearTick(tickId);
  }
});
