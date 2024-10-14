import { Vector3 } from '../core.interface';

export interface Furniture {
   name: string;
   model: string;
   position: Vector3;
   rotation: Vector3;
   textureVariation: string | null;
}
