import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { TransactionStatus, TransactionType } from './transaction.enum';
import { IProperty } from '../property/property.model';
import { IBankAccount } from './bank-account.model';


export interface ITransaction extends Base {
  bankAccount: Ref<IBankAccount>;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string;
  property?: Ref<IProperty>;
  targetBankAccount?: Ref<IBankAccount>;
  createdAt: Date;
}
