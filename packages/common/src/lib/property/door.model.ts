import { Vector3 } from '../core.interface';

export interface IDoor {
  id?: number;
  objectId: number;
  hashes?: number[];
  position: Vector3[];
  dimension: number;
  locked: boolean;
}
