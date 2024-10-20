import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ICharacterCreate, ProcedureKey } from '@bcrp-rage/common';


const playerCreateCharacterHandler = (characterCreate: ICharacterCreate,  { player }: ProcedureListenerInfo<PlayerMp>) => {

};

on(ProcedureKey.SERVER_PLAYER_CREATE_CHARACTER, playerCreateCharacterHandler);
