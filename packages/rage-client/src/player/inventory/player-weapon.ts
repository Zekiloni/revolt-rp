import { triggerServer } from '@libertymp/rage-rpc';
import { HexKeyCodes, ProcedureKey } from '@revolt-rp/common';
import { registerKeyBind } from '../../core/keybind-manager';
import { weaponRecoilConfig } from './weapon-recoil.config';


const SAVE_WEAPON_TIMEOUT_MS = 1250;
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

function playerRecoilHandler() {
  if (
    mp.players.local.isShooting() &&
    !mp.players.local.isDoingDriveby()
  ) {

    const weapon = mp.players.local.weapon;
    const data = weaponRecoilConfig[weapon];
    if (!data) return;

    let tv = 0;
    while (tv < data.recoil) {
      const pitch = mp.game.cam.getGameplayRelativePitch();

      if (mp.game.cam.getFollowPedViewMode() !== 4) {
        mp.game.cam.setGameplayCamRelativePitch(pitch + 0.1, 0.2);
      }

      tv += 0.1;
    }
  }
}

registerKeyBind(HexKeyCodes.R, true, playerReloadWeaponHandler);
mp.events.add({ render: playerRecoilHandler, playerWeaponShot: playerWeaponShotHandler });
