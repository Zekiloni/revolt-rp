import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';
import { playerDamage } from './player-damage.service';


function playerGetDamageHandler(data: IPlayerDamageData<PlayerMp>, { player }: ProcedureListenerInfo<PlayerMp>) {
  playerDamage(player, data.source, data.damage, data.weaponHash, data.boneIndex);
}

on(ProcedureKey.SERVER_PLAYER_DAMAGE, playerGetDamageHandler);
