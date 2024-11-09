import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ItemFlag } from './item-flag';
import { Vector3 } from '../core.interface';
import { IBaseItem } from './registry/base-item.model';

export interface IItem extends Base {
  name: string;
  dropped: boolean;
  localSlot: number;
  position?: Vector3;
  rotation?: Vector3;
  dimension?: number;
  quantity: number;
  ammoInClip?: number;
  serialNo?: string;
  usage?: number;
  expiringAt?: Date;
  purity?: number;
  buildProgress?: number;
  flag?: ItemFlag;
  createdAt: Date;
  updatedAt?: Date;
  data: IBaseItem;
}
