import { Vector3 } from '../core.interface';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface IItem extends Base, TimeStamps {
  name: string;
  dropped: boolean;
  localSlot: number;
  position?: Vector3;
  rotation?: Vector3;
  dimension?: number;
  quantity: number;
  ammoInClip?: number;
  serialNo?: string;
  durability?: number;
  expiringAt?: Date;
  purity?: number;
  buildProgress?: number;
  percentageOfDamage?: number;

  createdAt: Date;
  updatedAt?: Date;
}
