import { CharacterModel, } from '@revolt-rp/core';


export const getCharacterById = async (characterId: string) => {
  return CharacterModel.findById(characterId)
    .populate('membership')
    .exec();
}
