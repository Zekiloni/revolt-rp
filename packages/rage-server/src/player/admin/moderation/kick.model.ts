import { Document, Types } from 'mongoose';
import { IAccount, IKick } from '@revolt-rp/common';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Account } from '../../account/account.model';


@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true
    }
  }
})
export class Kick extends Document implements IKick {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ ref: () => Account, required: true })
  account: Ref<IAccount>;

  @prop({ required: true })
  reason: string;

  @prop({ ref: () => Account })
  admin?: Ref<IAccount>;

  createdAt: Date;
}


export const KickModel = getModelForClass(Kick);
