import { CharacterModel } from './character.model';
import { ICharacterCreate, ProcedureKey } from '@bcrp-rage/common';
import { AccountModel } from '../account/account.model';
import { characterConfig } from './character.config';
import { triggerClient } from '@libertymp/rage-rpc';


export const createCharacter = async (player: PlayerMp, characterCreate: ICharacterCreate) => {
  const character = await CharacterModel.create({
    ...characterCreate,
    cash: 5000
  });

  await AccountModel.updateOne(
    { id: player.account.id },
    { $push: { characters: character._id } }
  );

  return character;
};

export const getCharactersByAccountId = (accountId: string) => {
  return CharacterModel.find({ accountId }).exec();
};


export const spawnPlayerCharacter = (player: PlayerMp, initialSpawn = false) => {
  if (!player.character) return;

  triggerClient(ProcedureKey.CLIENT_TOGGLE_CHARACTER_CREATOR, false);

  if (initialSpawn) {
    player.character.position = characterConfig.defaultPosition;
    player.character.dimension = characterConfig.defaultDimension;
    player.spawn(player.character.position);
  }
};
