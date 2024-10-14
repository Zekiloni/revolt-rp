import { Vector3 } from '../core.interface';

export interface Item {
   id: string;
   name: string;
   dropped: boolean;
   position: Vector3 | null;
   rotation: Vector3 | null;
   dimension: number | null;
   quantity: number;
   ammoInClip?: number;
   serialNo?: string;
   durability?: number;
   expiringAt?: Date;
   purity?: number;
   buildProgress?: number;
   percentageOfDamage?: number;
}
