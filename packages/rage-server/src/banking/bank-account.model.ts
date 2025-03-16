import { Document, Types } from 'mongoose';
import { Ref, modelOptions, prop, getModelForClass } from '@typegoose/typegoose';
import { BankAccountType, IBankAccount } from '@revolt-rp/common';
import { Character } from '../player/character/character.model';


@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
  options: {
    customName: 'bank_accounts',
  }
})
export class BankAccount extends Document implements IBankAccount {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ required: true, unique: true })
  number: string;

  @prop({ ref: () => Character, required: true })
  character: Ref<Character>;

  @prop({ required: true, default: 0 })
  balance: number;

  @prop({ type: String, required: true, enum: Object.values(BankAccountType)})
  type: BankAccountType;

  @prop({ type: String, required: false, default: null })
  phoneNumber: string | null;

  createdAt!: Date;
  updatedAt?: Date;
}

export const BankAccountModel = getModelForClass(BankAccount);

