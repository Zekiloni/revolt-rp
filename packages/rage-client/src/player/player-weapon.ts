import { triggerServer } from '@libertymp/rage-rpc';
import { HexKeyCodes, ProcedureKey } from '@revolt-rp/common';
import { registerKeyBind } from '../core/keybind-manager';


const SAVE_WEAPON_TIMEOUT_MS = 1000;

let lastShootTimestamp: null | number = null;

function playerWeaponShotHandler(targetPosition: Vector3, targetEntity?: EntityMp) {
  const currentTimestamp = Date.now();

  if (lastShootTimestamp && (currentTimestamp - lastShootTimestamp) > SAVE_WEAPON_TIMEOUT_MS) {
    triggerServer(ProcedureKey.SERVER_PLAYER_SAVE_WEAPON);
  }

  lastShootTimestamp = currentTimestamp;

  if (mp.players.local.weapon && mp.players.local.weaponAmmo === 1) {
    mp.game.weapon.unequipEmptyWeapons = false;
  }
}

function playerReloadWeaponHandler() {
  if (mp.players.local.weapon && mp.players.local.weaponAmmo === 0) {
    triggerServer(ProcedureKey.SERVER_PLAYER_WEAPON_RELOAD);
  }
}

registerKeyBind(HexKeyCodes.R,  true, playerReloadWeaponHandler);
mp.events.add({ playerWeaponShot: playerWeaponShotHandler });
