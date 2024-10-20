import { getModelForClass } from '@typegoose/typegoose';
import {
  ICharacterApperance,
  CharacterGender,
  ICharacterSpawn,
  ICharacter,
  IInventoryItem
} from '@bcrp-rage/common';

export class Character implements ICharacter {
  appearance: ICharacterApperance;
  birthday: Date;
  defaultSpawn: ICharacterSpawn;
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
