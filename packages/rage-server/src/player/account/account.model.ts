import { accountConfig, AdminType, IAccount } from '@bcrp-rage/common';
import { getModelForClass, pre, prop, Ref } from '@typegoose/typegoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Character } from '../character/character.model';

@pre<Account>('save', function (next) {
  console.log(this.isNew, ' isNew')
  if (this.isModified('password') || this.isNew) {
    console.log(this)
    this.password = hashSync(this.password, genSaltSync(12));
    return next();
  }
})
export class Account implements IAccount {
  id: string;

  @prop({ required: true })
  username: string;
  coins: number;
  lastLoginAt: Date;
  referer: string;
  referralCode: string;
  serial: string;
  updatedBy: string;

  @prop({ required: true })
  emailAddress: string;

  socialClubUsername: string;

  @prop({ required: true })
  password: string;

  lastIpAddress?: string;

  @prop({ default: false })
  isEmailVerified: boolean;

  @prop()
  administrator?: AdminType;

  socialClubId: string;

  @prop({ default: accountConfig.DEFAULT_MAX_CHARACTERS })
  maxCharacters: number;

  @prop({ ref: () => Character, default: [] })
  characters: Ref<Character>[];

  createdAt: Date;

  updatedAt: Date;
}


