import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ItemFlag } from './item-flag';
import { Vector3 } from '../core.interface';
import { IBaseItem } from './registry/base-item.model';
import { IBankCardInfo } from './bank-card.model';
import { IWearableInfo } from './wearable-info.model';

export interface IItem extends Base {
  name: string;
  dropped: boolean;
  localSlot: number;
  position?: Vector3;
  rotation?: Vector3;
  dimension?: number;
  quantity: number;
  weaponAmmo?: number;
  serialNo?: string;
  usage?: number;
  equipped?: boolean;
  expiringAt?: Date;
  purity?: number;
  buildProgress?: number;
  flag?: ItemFlag;
  bankCardInfo?: IBankCardInfo;
  wearableInfo?: IWearableInfo;
  createdAt: Date;
  updatedAt?: Date;
  data: IBaseItem;
}
