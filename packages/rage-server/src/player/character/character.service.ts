import { getModelForClass } from '@typegoose/typegoose';
import { Character } from '@bcrp-rage/common';

const CharacterModel = getModelForClass(Character)

export const getCharactersByAccountId = (accountId: string) => {
	return CharacterModel.find({ accountId }).exec();
};
