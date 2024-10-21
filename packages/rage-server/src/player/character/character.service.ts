import { getModelForClass, Ref } from '@typegoose/typegoose';
import {
  ICharacterApperance,
  CharacterGender,
  ICharacterSpawn,
  ICharacter,
  IInventoryItem, BloodType, ICharacterInjury, ICharacterOrganization, CharacterStateType, CharacterStatus
} from '@bcrp-rage/common';

export class Character implements ICharacter {
  appearance: ICharacterApperance;
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
  id: string;
  inventory: IInventoryItem[];
  lastName: string;
  maxProperties: number;
  maxVehicles: number;
  position: Vector3;

}

const CharacterModel = getModelForClass(Character);

export const getCharactersByAccountId = (accountId: string) => {
  return CharacterModel.find({ accountId }).exec();
};
