import { getModelForClass, Ref } from '@typegoose/typegoose';
import {
  CharacterAppearance,
  CharacterGender,
  CharacterSpawn,
  IAccount,
  ICharacter,
  InventoryItem
} from '@bcrp-rage/common';

export class Character implements ICharacter {
  account: Ref<IAccount>;
  appearance: CharacterAppearance;
  birthday: Date;
  defaultSpawn: CharacterSpawn;
  firstName: string;
  gender: CharacterGender;
  id: string;
  inventory: InventoryItem[];
  lastName: string;
  maxProperties: number;
  maxVehicles: number;
  position: Vector3;

}

const CharacterModel = getModelForClass(Character)

export const getCharactersByAccountId = (accountId: string) => {
	return CharacterModel.find({ accountId }).exec();
};
