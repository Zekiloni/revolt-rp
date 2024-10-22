import { ICharacterCreate, ProcedureKey } from '@bcrp-rage/common';
import { characterConfig } from './character.config';
import { triggerClient } from '@libertymp/rage-rpc';
import { AccountModel, CharacterModel } from '../account-character.ref';


export const createCharacter = async (player: PlayerMp, characterCreate: ICharacterCreate) => {
  try {
    console.log('createCharacter 1');
    const character = await CharacterModel.create({
      ...characterCreate,
      cash: 5000
    });
    console.log('createCharacter 2');

    await AccountModel.updateOne(
      { id: player.account.id },
      { $push: { characters: character._id } }
    );
    console.log('createCharacter 3');

    return character;
  } catch (e) {
    return e;
  }
};

export const getCharactersByAccountId = (accountId: string) => {
  return CharacterModel.find({ accountId }).exec();
};


export const getCharacterById = (characterId: string) => {
  return CharacterModel.findById(characterId).exec();
};

export const spawnPlayerCharacter = (player: PlayerMp, initialSpawn = false) => {
  if (!player.character) return;

  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_CHARACTER_CREATOR, false);

  if (initialSpawn) {
    player.character.position = characterConfig.defaultPosition;
    player.character.dimension = characterConfig.defaultDimension;
    player.spawn(player.character.position);
  }
};


export const selectCharacter = (player: PlayerMp, characterId: string) => {
  CharacterModel.findById(characterId)
    .then((character) => {
      if (!character)
        return;

      triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION, false);

      player.character = character;
      spawnPlayerCharacter(player);
    });
};
