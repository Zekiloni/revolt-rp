import {
  BloodType, CharacterGender, CharacterSpawnType, CharacterStateType, CharacterStatus, IAccount,
  ICharacter,
  ICharacterAppearance,
  ICharacterInjury,
  ICharacterOrganization,
  ICharacterSpawn, IInventoryItem
} from '@bcrp-rage/common';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Account } from '../account/account.model';
import { characterConfig } from './character.config';
import { nanoid } from 'nanoid';

export class Character implements ICharacter {
  @prop({ required: true })
  firstName: string;

  @prop({ required: false })
  middleName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ type: Date, required: true })
  birthday: Date;

  @prop({ type: Object, default: () => ({ type: CharacterSpawnType.INITIAL_SPAWN }) })
  defaultSpawn: ICharacterSpawn;

  @prop({ required: false })
  accent: string;

  @prop({ default: 0 })
  adminJailTime: number;

  @prop({ required: true, enum: Object.values(BloodType) })
  bloodType: BloodType;

  @prop({ default: characterConfig.defaultCash })
  cash: number;

  @prop({ required: true, default: () => new Date() })
  createdAt: Date;

  deletedAt: Date;

  @prop()
  description: string;

  @prop({ default: characterConfig.defaultDimension })
  dimension: number;

  @prop({ default: () => nanoid(8) })
  dnaId: string;

  @prop({ default: characterConfig.defaultHeading })
  heading: number;

  @prop({ default: characterConfig.defaultHealth })
  health: number;

  @prop({ default: [] })
  injuries: ICharacterInjury[];

  @prop({ default: false })
  isRestrained: boolean;

  @prop({ type: Date, default: null })
  lastSessionAt: Date;

  @prop({ ref: () => Character, default: null })
  marriedTo: Ref<Character>;

  @prop({ default: () => nanoid(6) })
  maskId: string;

  @prop({ default: characterConfig.defaultLevel })
  level: number;

  @prop({ default: 0 })
  hours: number;

  @prop({ default: 0 })
  minutes: number;

  organization: ICharacterOrganization;

  @prop({ required: true })
  origin: string;

  @prop({ default: 0 })
  paycheck: number;

  @prop({ default: 0 })
  prisonTime: number;

  @prop({ default: CharacterStateType.ALIVE })
  state: CharacterStateType;

  @prop({ default: null })
  status: CharacterStatus;

  updatedAt: Date;

  @prop({ enum: Object.values(CharacterGender) })
  gender: CharacterGender;

  @prop()
  inventory: IInventoryItem[];

  @prop({ default: characterConfig.maxProperties })
  maxProperties: number;

  @prop({ default: characterConfig.defaultMaxVehicles })
  maxVehicles: number;

  @prop({ type: Object })
  appearance: ICharacterAppearance;

  @prop({ type: Object })
  position: Vector3;

  @prop({ ref: () => Account })
  account: Ref<Account>;
}

