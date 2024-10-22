import {
  BloodType, CharacterGender, CharacterStateType, CharacterStatus, IAccount,
  ICharacter,
  ICharacterAppearance,
  ICharacterInjury,
  ICharacterOrganization,
  ICharacterSpawn, IInventoryItem
} from '@bcrp-rage/common';
import { getModelForClass, Ref } from '@typegoose/typegoose';

export class Character implements ICharacter {
  appearance: ICharacterAppearance;
  birthday: Date;
  defaultSpawn: ICharacterSpawn;
  accent: string;
  adminJailTime: number;
  bloodType: BloodType;
  cash: number;
  createdAt: Date;
  deletedAt: Date;
  description: string;
  dimension: number;
  dnaId: string;
  heading: number;
  health: number;
  hours: number;
  injuries: ICharacterInjury[];
  isRestrained: boolean;
  lastSessionAt: Date;
  level: number;
  marriedTo: Ref<ICharacter>;
  maskId: string;
  middleName: string;
  minutes: number;
  organization: ICharacterOrganization;
  origin: string;
  paycheck: number;
  prisonTime: number;
  state: CharacterStateType;
  status: CharacterStatus;
  updatedAt: Date;
  firstName: string;
  gender: CharacterGender;
  inventory: IInventoryItem[];
  lastName: string;
  maxProperties: number;
  maxVehicles: number;
  position: Vector3;


  account: Ref<IAccount>;

}

export const CharacterModel = getModelForClass(Character);
