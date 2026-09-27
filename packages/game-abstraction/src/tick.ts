export type TickHandler = () => void;

export type TickUnsubscribe = () => void;

export interface ITick {
  add(handler: TickHandler): TickUnsubscribe;
}
