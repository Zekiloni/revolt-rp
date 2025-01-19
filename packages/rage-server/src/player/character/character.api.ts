import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ICharacterCreate, ProcedureKey } from '@revolt-rp/common';
import { createCharacter, selectCharacter, spawnPlayerCharacter } from './character.service';


const playerCreateCharacterHandler = (characterCreate: ICharacterCreate, { player }: ProcedureListenerInfo<PlayerMp>) => {
  createCharacter(player, characterCreate)
    .then(async (character) => {
      player.character = character;
      await spawnPlayerCharacter(player, true);
    })
    .catch(e => console.log(e));
};

const playerSelectCharacterHandler = (characterId: string, { player }: ProcedureListenerInfo<PlayerMp>) => {
  selectCharacter(player, characterId);
};

on(ProcedureKey.SERVER_PLAYER_CREATE_CHARACTER, playerCreateCharacterHandler);
on(ProcedureKey.SERVER_PLAYER_SELECT_CHARACTER, playerSelectCharacterHandler);
