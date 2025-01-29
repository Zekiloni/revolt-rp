import { calculateLevelUpQuota } from '@revolt-rp/common';


function givePlayerPayday(player: PlayerMp) {
  // todo: player payday
}

export async function playerPaydayCheck(player: PlayerMp) {
  player.character.minutes++;

  if (player.character.minutes >= 60) {
    const nextLevel = player.character.level + 1;
    player.character.hours += Math.floor(player.character.minutes / 60);
    player.character.minutes %= 60;

    givePlayerPayday(player);

    const nextLevelQuota = calculateLevelUpQuota(nextLevel);

    if (player.character.hours >= nextLevelQuota) {
      player.character.level++;
    }
  }

  await player.character.save();
}
