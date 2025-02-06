import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';
import { getPlayerWoundTimer, playerDamage, playerDeath } from './player-damage.service';


function playerGetDamageHandler(data: IPlayerDamageData<PlayerMp>, { player }: ProcedureListenerInfo<PlayerMp>) {
  playerDamage(player, data.source, data.damage, data.weaponHash, data.boneIndex);
}

async function playerDeathHandler(player: PlayerMp, reason: number, killer?: PlayerMp) {
  await playerDeath(player, reason, killer);
}

function playerGetWoundTimerHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  return getPlayerWoundTimer(player);
}

on(ProcedureKey.SERVER_PLAYER_DAMAGE, playerGetDamageHandler);
register(ProcedureKey.SERVER_PLAYER_GET_WOUND_TIMER, playerGetWoundTimerHandler);
mp.events.add({ playerDeath: playerDeathHandler });
