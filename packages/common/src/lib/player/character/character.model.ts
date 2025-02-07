import { Ref } from '@typegoose/typegoose';
import { BloodType, CharacterGender, CharacterSpawnType } from './character.enums';
import { Vector3 } from '../../core.interface';
import { IOrganization, IOrganizationRank } from '../../organization/organization.model';
import { ICharacterAppearance } from './char-appeaarance.model';
import { IAccount } from '../account/account.model';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import type { IItem } from '../../item/item.model';


export interface ICharacterSpawn {
  type: CharacterSpawnType;
  propertyId?: string;
}

export interface ICharacterStatus {
  status: 'locked' | 'character-kill';
  statusChangeDate: Date;
}

export interface ICharacterInjury {
  bodyPart: string;
  issuer?: string;
  cause: string;
  damage: number;
}

export interface ICharacterOrganization {
  organization: Ref<IOrganization>;
  rank?: Ref<IOrganizationRank>;
}

export interface ICharacter extends Base {
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  gender: CharacterGender;
  account: Ref<IAccount>;
  birthday: Date;
  cash: number;
  paycheck: number;
  origin: string;
  description?: string;
  health: number;
  accent?: string;
  isWounded: boolean;
  member?: ICharacterOrganization;
  injuries: ICharacterInjury[];
  isRestrained: boolean;
  appearance: ICharacterAppearance;
  bloodType: BloodType;
  defaultSpawn: ICharacterSpawn;
  inventory: Ref<IItem>[];
  maskId: string;
  dnaId: string;
  position: Vector3;
  heading: number;
  dimension: number;
  level: number;
  hours: number;
  minutes: number;
  maxVehicles: number;
  maxProperties: number;
  marriedTo?: Ref<ICharacter>;
  adminJailTime?: number;
  prisonTime?: number;
  drunk: number;
  thirst: number;
  deaths: number;
  kills: number;
  lastSessionAt?: Date;
  updatedAt?: Date;
  createdAt: Date;
  status?: ICharacterStatus;
  deletedAt?: Date;
}
