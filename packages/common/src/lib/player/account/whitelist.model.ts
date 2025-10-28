import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref } from '@typegoose/typegoose';
import { IAccount } from './account.model';

export enum WhitelistStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IWhitelistAnswer {
  question: string;
  answer: string;
}

export interface IWhitelist extends Base {
  account: Ref<IAccount>;
  status: WhitelistStatus;
  grade: number;
  answers: IWhitelistAnswer[];
  note?: string;
  reviewedBy?: Ref<IAccount>;
  createdAt: Date;
  updatedAt?: Date;
}
