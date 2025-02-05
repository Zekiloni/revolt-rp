import { CaliberType, IPlayerDamageData } from '@revolt-rp/common';
import { getPlayerSelectedItem } from '../inventory/player-inventory.service';
import { WeaponItem } from '../../item/registry/weapon-item.model';

const playerDamageInfo = new Map<PlayerMp, IPlayerDamageData<PlayerMp>[]>();

export function playerDamage(player: PlayerMp, issuer: PlayerMp, damage: number, weaponHash: number, boneIndex: number) {
  if (!player || damage <= 0) return;

  const currentTime = Date.now();

  if (!playerDamageInfo.has(player))
    playerDamageInfo.set(player, []);

  const damages = playerDamageInfo.get(player);

  let caliberType: CaliberType | undefined;

  if (weaponHash != RageEnums.Hashes.Weapon.UNARMED) {
    const weaponItem = getPlayerSelectedItem(issuer);
    if (weaponItem && weaponItem.data.isWeapon) {
      const weapon = weaponItem.data as WeaponItem;
      if (weapon.weaponHash == weaponHash) {
        caliberType = weapon.caliberType;
      }
    }
  }

  damages.push({
    source: issuer,
    weaponHash,
    boneIndex,
    damage,
    caliberType,
    timestamp: currentTime
  });
}


export const getPlayerDamage = (player: PlayerMp) => {
  return playerDamageInfo.get(player);
};
