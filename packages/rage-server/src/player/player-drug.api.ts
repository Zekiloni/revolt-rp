import { playerDrugHandler } from "./player-drug.service";


setInterval(() => {
  mp.players.toArray()
    .filter(player => player.account && player.character)
    .forEach(player => playerDrugHandler(player));
}, 60000);
