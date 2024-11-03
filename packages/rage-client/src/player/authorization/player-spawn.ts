import { toggleHud } from '../player-hud';

mp.events.add({
  playerSpawn() {
    mp.game.ui.displayRadar(true);
    mp.gui.chat.show(true);
    toggleHud(true);
  }
});
