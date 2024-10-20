import { accountConfig, AdminType, IAccount } from '@bcrp-rage/common';
import { getModelForClass, pre, prop, Ref } from '@typegoose/typegoose';
import { Character } from '../character/character.service';
import { genSaltSync, hashSync } from 'bcryptjs';

@pre<Account>('save', function (next) {
  console.log(this.isNew, ' isNew')
  if (this.isModified('password') || this.isNew) {
    console.log(this)
    this.password = hashSync(this.password, genSaltSync(12));
    return next();
  }
})
export class Account implements IAccount {
  @prop({ required: true })
  username: string;

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


export const AccountModel = getModelForClass(Account);
