import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ItemFlag } from './item-flag';
import { IVector3 } from '../core.interface';
import { IBaseItem } from './registry/base-item.model';
import { IBankCardInfo } from './bank-card.model';
import { IWearableInfo } from './wearable-info.model';
import { IHandheldRadioConfig } from './handheld-radio.model';
import { IPhoneInfo } from './phone.model';
import { IDocumentInfo } from './document.model';

export interface IItem extends Base {
  name: string;
  dropped: boolean;
  localSlot: number;
  position?: IVector3;
  rotation?: IVector3;
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
  radioConfig?: IHandheldRadioConfig;
  documentInfo?: IDocumentInfo;
  phoneInfo?: IPhoneInfo;
  createdAt: Date;
  updatedAt?: Date;
  readonly data?: IBaseItem;
}
