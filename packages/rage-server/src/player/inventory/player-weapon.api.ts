import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { playerReloadWeapon } from './player-weapon.service';


async function playerReloadWeaponHandler(params: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  if (player.weapon) {
    await playerReloadWeapon(player, player.weapon);
  }
}


function playerUpdateWeaponHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  // todo
}

on(ProcedureKey.SERVER_PLAYER_WEAPON_RELOAD, playerReloadWeaponHandler);
on(ProcedureKey.SERVER_PLAYER_SAVE_WEAPON, playerUpdateWeaponHandler);
