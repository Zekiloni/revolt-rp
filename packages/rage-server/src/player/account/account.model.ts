import { Document, Types } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { modelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { accountConfig, AdminType, IAccount } from '@bcrp-rage/common';
import { Character } from '../character/character.model';

@pre<Account>('save', function(next) {
  console.log(this.isNew, ' isNew');
  if (this.isModified('password') || this.isNew) {
    console.log(this);
    this.password = hashSync(this.password, genSaltSync(12));
    return next();
  }
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
})
export class Account extends Document implements IAccount {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ required: true })
  username: string;

  coins: number;

  @prop({ required: false })
  lastLoginAt?: Date;

  referer: string;
  referralCode: string;
  serial: string;
  updatedBy: string;

  @prop({ required: true })
  emailAddress: string;

  socialClubUsername: string;

  socialClubId: string;

  @prop({ required: true })
  password: string;

  @prop({ required: false })
  lastIpAddress?: string;

  @prop({ default: false })
  isEmailVerified: boolean;

  @prop()
  administrator?: AdminType;

  @prop({ default: accountConfig.DEFAULT_MAX_CHARACTERS })
  maxCharacters: number;

  @prop({ ref: () => Character, default: [] })
  characters: Ref<Character>[];

  createdAt!: Date;

  updatedAt!: Date;
}


