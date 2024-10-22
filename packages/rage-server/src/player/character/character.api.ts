import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { catchError, ICharacterCreate, ProcedureKey } from '@bcrp-rage/common';
import { createCharacter, spawnPlayerCharacter } from './character.service';


const playerCreateCharacterHandler = async (characterCreate: ICharacterCreate, { player }: ProcedureListenerInfo<PlayerMp>) => {

  createCharacter(player, characterCreate)
    .then((character) => {

      player.character = character;
      spawnPlayerCharacter(player);
    })
    .catch(catchError);
};

on(ProcedureKey.SERVER_PLAYER_CREATE_CHARACTER, playerCreateCharacterHandler);
