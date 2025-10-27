import { IVector3 } from '../core.interface';

export interface IDoor {
  id?: number;
  objectId: number;
  hashes?: number[];
  position: IVector3[];
  dimension: number;
  locked: boolean;
}
