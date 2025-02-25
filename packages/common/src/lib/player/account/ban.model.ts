import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref } from '@typegoose/typegoose';
import { IAccount } from './account.model';


export interface IBan extends Base {
  account: Ref<IAccount>;
  reason: string;
  ipAddress: string;
  admin?: Ref<IAccount>;
  expiringAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
