import { CaliberType, IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';
import { getPlayerSelectedItem } from '../inventory/player-inventory.service';
import { WeaponItem } from '../../item/registry/weapon-item.model';
import { setPlayerHealth, setPlayerWounded } from '../character/character.service';
import { characterConfig } from '../character/character.config';
import { PlayerDeathModel } from './player-death.model';
import { Types } from 'mongoose';
import dayjs from 'dayjs';
import { notifyPlayer } from '../util/player-notify.util';
import { t } from 'i18next';
import { triggerBrowsers } from '@libertymp/rage-rpc';

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

async function getPlayerActiveDeath(player: PlayerMp) {
  return PlayerDeathModel.findOne({ target: player.character._id, giveUp: false })
    .sort({ createdAt: -1 })
    .populate('killer')
    .exec();
}

export const getPlayerWoundTimer = async (player: PlayerMp) => {
  const death = await getPlayerActiveDeath(player);

  if (death) {
    const secondsSinceDeath = dayjs().diff(dayjs(death.createdAt), 'second');
    return Math.max(0, characterConfig.giveUpTime - secondsSinceDeath);
  } else
    return 0;
};

export async function playerDeath(player: PlayerMp, reason: number, killer?: PlayerMp) {
  if (player.character) {
    setPlayerWounded(player, true);
    setPlayerHealth(player, characterConfig.woundedHealth);

    await PlayerDeathModel.create({
      target: player.character,
      reason,
      killer: killer?.character
    });

    player.character.deaths ++;
    player.character.position = player.position;
    await player.character.save();

    if (killer && killer.character) {
      killer.character.kills ++;
      await killer.character.save();
    }
  }
}


export async function playerGiveUp(player: PlayerMp) {
  if (!player.character.isWounded) {
    return notifyPlayer(player, { severity: 'error', detail: t('you_are_not_wounded') });
  }

  const death = await getPlayerActiveDeath(player);

  if (death) {
    const secondsSinceDeath = dayjs().diff(dayjs(death.createdAt), 'second');

    if (secondsSinceDeath < characterConfig.giveUpTime) {
      return notifyPlayer(player, { severity: 'error', detail: t('you_cant_give_up_yet') });
    }

    death.giveUp = true;
    await death.save();

    setPlayerWounded(player, false);
    setPlayerHealth(player, characterConfig.defaultHealth);

    player.character.position = player.position;

    await player.character.save();
  }
}
