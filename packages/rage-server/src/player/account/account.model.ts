import { Document, Types } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { modelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { accountConfig, AdminType, IAccount } from '@revolt-rp/common';
import { Character } from '../character/character.model';

@pre<Account>('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    if (this.password)
      this.password = hashSync(this.password, genSaltSync(12));
  }

  return next();
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

  @prop({ default: 0 })
  coins: number;

  @prop({ required: false })
  lastLoginAt?: Date;

  @prop({ required: false })
  referer?: string;

  referralCode: string;

  serial: string;

  updatedBy: string;

  @prop({ required: false })
  emailAddress?: string;

  @prop({ required: true })
  socialClubUsername: string;

  @prop({ required: true })
  socialClubId: string;

  @prop({ required: false, default: null })
  password: string;

  @prop({ required: false })
  lastIpAddress?: string;

  @prop({ required: false })
  discordId?: string;

  @prop({ default: false })
  isEmailVerified: boolean;

  @prop({ enum: AdminType, type: Number, default: AdminType.NONE })
  administrator?: AdminType;

  @prop({ default: accountConfig.DEFAULT_MAX_CHARACTERS })
  maxCharacters: number;

  @prop({ ref: () => Character, default: [] })
  characters: Ref<Character>[];

  createdAt!: Date;

  updatedAt!: Date;
}


