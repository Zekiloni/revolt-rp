import { IPlayerDamageData } from '@revolt-rp/common';

const playerDamageInfo = new Map<PlayerMp, IPlayerDamageData<PlayerMp>[]>();

export function playerDamage(player: PlayerMp, issuer: PlayerMp, damage: number, weapon: number, boneIndex: number) {
  if (!player || damage <= 0) return;

  const currentTime = Date.now();

  if (!playerDamageInfo.has(player))
    playerDamageInfo.set(player, []);

  const damages = playerDamageInfo.get(player);

  damages.push({
    source: issuer,
    weapon,
    boneIndex,
    damage,
    timestamp: currentTime
  });
}


export const getPlayerDamage = (player: PlayerMp) => {
  return playerDamageInfo.get(player);
};
