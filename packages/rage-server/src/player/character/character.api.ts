import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { CharacterCreate, ProcedureKey } from '@bcrp-rage/common';


const playerCreateCharacterHandler = (characterCreate: CharacterCreate,  { player }: ProcedureListenerInfo<PlayerMp>) => {

};

on(ProcedureKey.SERVER_PLAYER_CREATE_CHARACTER, playerCreateCharacterHandler);
