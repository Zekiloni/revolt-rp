import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';
import { playerDamage, playerDeath } from './player-damage.service';


function playerGetDamageHandler(data: IPlayerDamageData<PlayerMp>, { player }: ProcedureListenerInfo<PlayerMp>) {
  playerDamage(player, data.source, data.damage, data.weaponHash, data.boneIndex);
}

async function playerDeathHandler(player: PlayerMp, reason: number, killer?: PlayerMp) {
  await playerDeath(player, reason, killer);
}

on(ProcedureKey.SERVER_PLAYER_DAMAGE, playerGetDamageHandler);
mp.events.add({ playerDeath: playerDeathHandler });
