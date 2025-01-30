import { Document, Types } from 'mongoose';
import { Ref, modelOptions, prop, getModelForClass } from '@typegoose/typegoose';
import { BankAccountType, IBankAccount } from '@revolt-rp/common';
import { Character } from '../player/character/character.model';
import { Item } from '../item/item.model';


@modelOptions({
  schemaOptions: {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  },
  options: {
    customName: 'bank_accounts'
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
}

export const BankAccountModel = getModelForClass(BankAccount);

