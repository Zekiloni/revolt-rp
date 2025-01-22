import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { playerReloadWeapon } from './player-weapon.service';


function playerReloadWeaponHandler(params: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  if (player.weapon) {
    playerReloadWeapon(player, player.weapon);
  }
}

on(ProcedureKey.SERVER_PLAYER_WEAPON_RELOAD, playerReloadWeaponHandler)
