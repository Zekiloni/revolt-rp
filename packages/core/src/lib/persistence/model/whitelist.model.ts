import { Document, Types } from 'mongoose';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { IAccount, IWhitelist, IWhitelistAnswer, WhitelistStatus } from '@revolt-rp/common';
import { Account } from './account.model';
import { whitelistConfig } from '@revolt-rp/core';


@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true
    }
  }
})
export class Whitelist extends Document implements IWhitelist {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ ref: () => Account, required: true })
  account: Ref<IAccount>;

  @prop({ type: [Object], required: true, default: [] })
  answers: IWhitelistAnswer[];

  @prop({ type:  [Object], required: true ,default: [] })
  essayAnswers: IWhitelistAnswer[];

  @prop({ type: Number, required: true, default: 0 })
  grade: number;

  @prop({ type: String, required: false })
  note?: string;

  @prop({ ref: () => Account, required: false })
  reviewedBy: Ref<IAccount>;

  @prop({ type: String, enum: Object.values(WhitelistStatus), required: true, default: WhitelistStatus.PENDING })
  status: WhitelistStatus;

  createdAt: Date;
  updatedAt: Date;
}


