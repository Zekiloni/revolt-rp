import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { playerReloadWeapon, playerUpdateWeapon } from './player-weapon.service';


async function playerReloadWeaponHandler(params: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  if (player.weapon) {
    await playerReloadWeapon(player, player.weapon);
  }
}


async function playerUpdateWeaponHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  if (player.weapon) {
    await playerUpdateWeapon(player, player.weapon);
  }
}

on(ProcedureKey.SERVER_PLAYER_WEAPON_RELOAD, playerReloadWeaponHandler);
on(ProcedureKey.SERVER_PLAYER_SAVE_WEAPON, playerUpdateWeaponHandler);
