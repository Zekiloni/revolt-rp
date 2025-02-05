import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';
import { playerDamage } from './player-damage.service';


function playerGetDamageHandler(data: IPlayerDamageData<PlayerMp>, { player }: ProcedureListenerInfo<PlayerMp>) {
  playerDamage(player, data.source, data.damage, data.weapon, data.boneIndex);
}

on(ProcedureKey.SERVER_PLAYER_GET_DAMAGE, playerGetDamageHandler);
