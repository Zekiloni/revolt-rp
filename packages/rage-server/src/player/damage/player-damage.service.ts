import { CaliberType, CharacterStateType, IPlayerDamageData } from '@revolt-rp/common';
import { getPlayerSelectedItem } from '../inventory/player-inventory.service';
import { WeaponItem } from '../../item/registry/weapon-item.model';
import { setPlayerHealth, setPlayerState } from '../character/character.service';
import { characterConfig } from '../character/character.config';

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


export async function playerDeath(player: PlayerMp, reason: number, killer?: PlayerMp) {
  // todo: message & logging

  if (player.character) {
    setPlayerState(player, CharacterStateType.WOUNDED);
    setPlayerHealth(player, characterConfig.woundedHealth);

    player.character.position = player.position;

    await player.character.save();
  }
}
