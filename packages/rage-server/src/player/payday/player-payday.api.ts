import { playerPaydayCheck } from './player-payday.service';


setInterval(() => {
  mp.players.toArray()
    .filter(player => player.account && player.character)
    .forEach(player => playerPaydayCheck(player));
}, 60000);
