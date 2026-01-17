import { IVector3 } from "./core.interface";

export interface IAudio3D {
  id: string;
  url: string;
  source: {
    type: 'vehicle' | 'object';
    id: number;
  }
  position: IVector3;
  loop: boolean;
  volume: number;
  range: number;
  paused: boolean;
  pausedAt?: number;
  startedAt: number;
}

export interface IRadioStation {
  name: string;
  url: string;
}
