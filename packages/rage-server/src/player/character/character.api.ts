import { FilterQuery } from 'mongoose';
import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { ICharacterCreate, ProcedureKey } from '@revolt-rp/common';
import { Character } from '@revolt-rp/core';
import { createCharacter, findCharacter, selectCharacter, spawnPlayerCharacter } from './character.service';


const playerCreateCharacterHandler = (characterCreate: ICharacterCreate, { player }: ProcedureListenerInfo<PlayerMp>) => {
  createCharacter(player, characterCreate)
    .then(async (character) => {
      player.character = character;
      await spawnPlayerCharacter(player, true, characterCreate.outfit);
    })
    .catch(e => console.log(e));
};

const playerSelectCharacterHandler = (characterId: string, { player }: ProcedureListenerInfo<PlayerMp>) => {
  selectCharacter(player, characterId);
};

function getPlayerCharacterHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  return player.character;
}

function findCharacterHandler(query: FilterQuery<Character>) {
  return findCharacter(query);
}


on(ProcedureKey.SERVER_PLAYER_CREATE_CHARACTER, playerCreateCharacterHandler);
on(ProcedureKey.SERVER_PLAYER_SELECT_CHARACTER, playerSelectCharacterHandler);
register(ProcedureKey.SERVER_GET_PLAYER_CHARACTER, getPlayerCharacterHandler);
register(ProcedureKey.SERVER_FIND_CHARACTER, findCharacterHandler);
