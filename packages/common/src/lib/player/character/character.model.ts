import { Ref } from '@typegoose/typegoose';
import { BloodType, CharacterGender, CharacterSpawnType } from './character.enums';
import { Vector3 } from '../../core.interface';
import { IOrganization, IOrganizationRank } from '../../organization/organization.model';

export interface HeadBlendData {
  headBlendData: {
    shapeFirstId: number,
    shapeSecondId: number,
    shapeThirdId: number,
    skinFirstId: number,
    skinSecondId: number,
    skinThirdId: number,
    shapeMix: number,
    skinMix: number,
    thirdMix: number,
    isParent: boolean
  };
}

export interface FaceFeature {
  faceFeature: [
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number,
    number, number, number, number
  ];
}

export interface ICharacterApperance extends HeadBlendData, FaceFeature {
  eyeColor: number;
  hairStyle: number;
  hairColor: number;
  hairHighlightColor: number;
}

export interface ICharacterSpawn {
  type: CharacterSpawnType;
  propertyId?: string;
}

export interface IInventoryItem {
  item: string;
  localSlot?: number;
}

export interface CharacterStatus {
  status: 'locked' | 'character-kill';
  statusChangeDate: Date;
}

export interface ICharacterInjury {
  bodyPart: string;
  issuer?: string;
  cause: string;
  damage: number;
}

export const enum CharacterStateType {
  ALIVE = 'alive',
  WOUNDED = 'wounded',
  DEAD = 'dead'
}

export interface ICharacterOrganization {
  organization: Ref<IOrganization>;
  rank?: Ref<IOrganizationRank>;
}

export interface ICharacter {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: CharacterGender;
  birthday: Date;
  cash: number;
  paycheck: number;
  origin: string;
  description?: string;
  health: number;
  accent?: string;
  state: CharacterStateType;
  organization?: ICharacterOrganization;
  injuries: ICharacterInjury[];
  isRestrained: boolean;
  appearance: ICharacterApperance;
  bloodType: BloodType;
  defaultSpawn: ICharacterSpawn;
  inventory: IInventoryItem[];
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
  lastSessionAt?: Date;
  updatedAt?: Date;
  createdAt: Date;
  status?: CharacterStatus;
  deletedAt?: Date;
}
