import { CharacterModel } from '@revolt-rp/core';


export const getCharacterById = async (characterId: string) => {
  return CharacterModel.findById(characterId)
    .populate([
      {
        path: 'membership',
        populate: [
          { path: 'rank' },
          { path: 'organization' }
        ]
      },
      {
        path: 'job',
        populate: 'property'
      }
    ])
    .exec();
};

