import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { ICharacterCreate, ProcedureKey } from '@bcrp-rage/common';
import { createCharacter, selectCharacter, spawnPlayerCharacter } from './character.service';


const playerCreateCharacterHandler = async (characterCreate: ICharacterCreate, { player }: ProcedureListenerInfo<PlayerMp>) => {
  createCharacter(player, characterCreate)
    .then((character) => {
      player.character = character;
      spawnPlayerCharacter(player);
    })
    .catch(e => console.log(e));
};

const playerSelectCharacterHandler = (characterId: string, { player }: ProcedureListenerInfo<PlayerMp>) => {
  return selectCharacter(player, characterId);
};

on(ProcedureKey.SERVER_PLAYER_CREATE_CHARACTER, playerCreateCharacterHandler);
on(ProcedureKey.SERVER_PLAYER_SELECT_CHARACTER, playerSelectCharacterHandler);
