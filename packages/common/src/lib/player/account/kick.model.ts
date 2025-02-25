import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref } from '@typegoose/typegoose';
import { IAccount } from './account.model';


export interface IKick extends Base {
  account: Ref<IAccount>;
  reason: string;
  admin?: Ref<IAccount>;
  createdAt: Date;
}
