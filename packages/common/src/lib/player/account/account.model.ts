import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ICharacter } from '../character/character.model';
import { IWhitelist } from './whitelist.model';

export enum AdminType {
  NONE = 0,
  TESTER = 1,
  JUNIOR_ADMIN = 2,
  ADMINISTRATOR = 3,
  SENIOR_ADMIN = 4,
  LEAD_ADMIN = 5,
  SUPER_ADMIN = 6,
}

export enum AccountPreferences   {
  MUTE_OOC = 'toggle_ooc',
  MUTE_REPORTS = 'toggle_reports',
  MUTE_ADMIN_ALERTS = 'toggle_admin_alerts',
  MUTE_ADMIN_CHAT = 'toggle_admin_chat',
  MUTE_PM = 'toggle_pm',
}


export interface IAccountAuthorize {
  username: string;
  password: string;
}


export interface IAccountCreate {
  username: string;
  password: string;
  emailAddress: string;
}


export interface IMailVerification {
  account: Ref<IAccount>;
  verificationCode: string;
  createdAt: Date;
  expiringAt: Date;
  verifiedAt?: Date;
}

export interface IAccount<T = Ref<ICharacter>, E = Ref<IWhitelist>> extends Base {
  username: string;
  emailAddress?: string;
  password: string;
  isEmailVerified: boolean;
  lastIpAddress?: string;
  referralCode: string;
  referer?: string;
  administrator: AdminType;
  maxCharacters: number;
  serial: string;
  socialClubUsername: string;
  discordId?: string;
  discordUsername?: string;
  coins: number;
  socialClubId?: string;
  mutedUntil?: Date;
  lastLoginAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
  createdAt: Date;
  characters: T[];
  whitelist: E[];
  preferences: AccountPreferences[];
}
