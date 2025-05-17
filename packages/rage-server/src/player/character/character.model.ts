import { nanoid } from 'nanoid';
import { Document, Types } from 'mongoose';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import {
  BloodType, CharacterGender, CharacterSpawnType, ICharacterStatus,
  ICharacter,
  ICharacterAppearance,
  ICharacterInjury,
  ICharacterSpawn, ICharacterJob, JobKey
} from '@revolt-rp/common';
import { characterConfig } from './character.config';
import { Account } from '../account/account.model';
import { Item } from '../../item/item.model';
import { Organization } from '../../organization/organization.model';
import { OrganizationRank } from '../../organization/rank/organization-rank.model';
import { Property } from '../../property/property.model';


export class CharacterSpawnOption {
  type: CharacterSpawnType;
  propertyId?: string;
}

export class CharacterJob implements ICharacterJob {
  @prop({ enum: Object.values(JobKey), type: String, required: false })
  jobKey?: JobKey;

  @prop({ ref: () => Property, required: true })
  property: Ref<Property>;

  @prop({ required: false })
  salary?: number;

  @prop({ required: true, default: () => new Date() })
  createdAt: Date;
}

class CharacterMembership {
  @prop({ ref: () => Organization })
  organization!: Ref<Organization>;

  @prop({ ref: () => OrganizationRank, default: null })
  rank?: Ref<OrganizationRank>;
}

@modelOptions({
  schemaOptions: {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
})
export class Character extends Document implements ICharacter {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: false })
  middleName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ type: Date, required: true })
  birthday: Date;

  @prop({
    type: Object,
    default: characterConfig.defaultSpawn
  })
  defaultSpawn: ICharacterSpawn;

  @prop({ required: false })
  accent: string;

  @prop({ default: 0 })
  adminJailTime: number;

  @prop({ required: true, enum: Object.values(BloodType), type: String })
  bloodType: BloodType;

  @prop({ default: characterConfig.defaultCash })
  cash: number;

  @prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @prop({ default: null })
  deletedAt: Date | null;

  @prop()
  description: string;

  @prop({ default: characterConfig.defaultDimension })
  dimension: number;

  @prop({ default: () => nanoid(8) })
  dnaId: string;

  @prop({ default: characterConfig.defaultHeading, type: Number })
  heading: number;

  @prop({ default: characterConfig.defaultHealth, type: Number })
  health: number;

  @prop({ type: [Object], default: [] })
  injuries: ICharacterInjury[];

  @prop({ default: false })
  isCuffed: boolean;

  @prop({ type: Date, default: null })
  lastSessionAt?: Date;

  //
  // @prop({ ref: () => Character, default: null })
  // marriedTo: Ref<Character>;

  @prop({ default: () => nanoid(6) })
  maskId: string;

  @prop({ default: characterConfig.defaultLevel })
  level: number;

  @prop({ default: 0 })
  hours: number;

  @prop({ default: 0 })
  minutes: number;

  @prop({ required: false, default: false })
  inGame: boolean;

  @prop({ type: () => CharacterMembership, default: null })
  membership: CharacterMembership | null;

  @prop({ type: Boolean, default: false })
  isLeader: boolean;

  @prop({ required: true })
  origin: string;

  @prop({ default: 0 })
  paycheck: number;

  @prop({ default: 0 })
  prisonTime: number;

  @prop({ default: false })
  isWounded: boolean;

  @prop({ type: Object, default: null })
  status: ICharacterStatus;

  updatedAt: Date;

  @prop({ enum: Object.values(CharacterGender), type: String })
  gender: CharacterGender;

  @prop({ ref: () => Item })
  inventory: Ref<Item>[];

  @prop({ default: characterConfig.maxProperties })
  maxProperties: number;

  @prop({ default: characterConfig.defaultMaxVehicles })
  maxVehicles: number;

  @prop({ type: Object })
  appearance: ICharacterAppearance;

  @prop({ type: Object })
  position: Vector3;

  @prop({ type: Number, default: 0 })
  drunk: number;

  @prop({ type: Number, default: 0 })
  thirst: number;

  @prop({ type: Number, default: 0 })
  deaths: number;

  @prop({ type: Number, default: 0 })
  kills: number;

  @prop({ ref: () => Account })
  account: Ref<Account>;

  @prop({ type: CharacterJob, default: null })
  job: ICharacterJob | null;

  get fullName(): string {
    return this.middleName
      ? `${this.firstName} ${this.middleName} ${this.lastName}`
      : `${this.firstName} ${this.lastName}`;
  }
}
