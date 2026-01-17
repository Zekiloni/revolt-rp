import { IVector3 } from '../core.interface';

export interface Furniture {
   name: string;
   model: string;
   position: IVector3;
   rotation: IVector3;
   textureVariation: string | null;
}
