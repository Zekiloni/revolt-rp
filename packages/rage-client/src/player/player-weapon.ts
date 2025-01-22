import { triggerServer } from '@libertymp/rage-rpc';
import { HexKeyCodes, ProcedureKey } from '@revolt-rp/common';
import { registerKeyBind } from '../core/keybind-manager';

let lastShootTimestamp: null | number = null;

function playerWeaponShotHandler(targetPosition: Vector3, targetEntity?: EntityMp) {
  lastShootTimestamp = Date.now();
}

function playerReloadWeaponHandler() {
  if (mp.players.local.weapon && mp.players.local.weaponAmmo === 0) {
    triggerServer(ProcedureKey.SERVER_PLAYER_WEAPON_RELOAD);
  }
}

registerKeyBind(HexKeyCodes.R,  true, playerReloadWeaponHandler);
mp.events.add({ playerWeaponShot: playerWeaponShotHandler });
