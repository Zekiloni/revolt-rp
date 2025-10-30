import { Document, Types } from 'mongoose';
import { getModelForClass, modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { IBan } from '@revolt-rp/common';
import { Account } from './account.model';


@modelOptions({
  schemaOptions: {
    timestamps: true,
  }
})
export class Ban extends Document implements IBan {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ ref: () => Account, required: false })
  account?: Ref<Account>;

  @prop({ ref: () => Account })
  admin?: Ref<Account>;

  @prop({ required: true })
  ipAddress: string;

  @prop({ required: true })
  reason: string;

  @prop({ required: false })
  expiringAt: Date;

  @prop({ required: false })
  deletedAt?: Date;

  createdAt: Date;
  updatedAt?: Date;
}
