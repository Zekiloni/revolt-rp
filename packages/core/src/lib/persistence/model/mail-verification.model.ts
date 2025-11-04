import { Document, Types } from 'mongoose';
import { modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { IAccount, IMailVerification } from '@revolt-rp/common';
import { Account } from './account.model';

const number = 24 * 60 * 60 * 1000;

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true
    }
  }
})
export class MailVerification extends Document implements IMailVerification {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ ref: () => Account, required: true })
  account: Ref<IAccount>;

  @prop({ required: true })
  verificationCode: string;

  @prop({ required: true, default: () => new Date(Date.now() + number) })
  expiringAt: Date;

  @prop({ required: false, default: null })
  verifiedAt?: Date;

  createdAt!: Date;
}


