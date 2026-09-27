export type LocalEventHandler = (...args: unknown[]) => void;

export type NetEventHandler = (source: number, ...args: unknown[]) => void;

export interface IEvents {
  on(event: string, handler: LocalEventHandler): void;
  emit(event: string, ...args: unknown[]): void;
  onNet(event: string, handler: NetEventHandler): void;
  emitNet(target: number, event: string, ...args: unknown[]): void;
}
