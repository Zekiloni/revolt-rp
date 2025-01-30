import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { IBankAccount } from './bank-account.model';
import { TransactionStatus, TransactionType } from './transaction.enum';

export interface ITransaction extends Base {
  bankAccount: Ref<IBankAccount>;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string;
  targetBankAccount?: Ref<IBankAccount>;
  createdAt: Date;
}
