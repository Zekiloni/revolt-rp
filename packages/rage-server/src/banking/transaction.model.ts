import { ITransaction, TransactionStatus, TransactionType } from '@revolt-rp/common';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Document, Types } from 'mongoose';
import { BankAccount } from './bank-account.model';


@modelOptions({
  options: {
    customName: 'transactions'
  },
  schemaOptions: {
    timestamps: {
      createdAt: true
    },
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
})
export class Transaction extends Document implements ITransaction {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ ref: () => BankAccount, required: true })
  bankAccount: Ref<BankAccount>;

  @prop({ type: String, required: true, enum: Object.values(TransactionType) })
  type: TransactionType;

  @prop({ type: String, required: true, enum: Object.values(TransactionStatus) })
  status: TransactionStatus;

  @prop({ type: Number, required: true })
  amount: number;

  @prop({ type: String, required: true })
  description: string;

  @prop({ ref: () => BankAccount, required: false })
  targetBankAccount?: Ref<BankAccount>;

  createdAt!: Date;
}


export const TransactionModel = getModelForClass(Transaction);
