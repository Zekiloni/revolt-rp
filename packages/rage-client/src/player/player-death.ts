import { CharacterStateType, GameUiKey, PlayerSharedDataType } from '@revolt-rp/common';
import { hideGameInterface, showGameInterface } from '../core/browser';


mp.game.gameplay.setFadeOutAfterDeath(false);

let isDeathScreenActive = false;

function toggleDeathScreen(toggle: boolean) {
  mp.gui.chat.push(`Death screen toggled: ${toggle}`);
  isDeathScreenActive = toggle;
  if (toggle) {
    showGameInterface(GameUiKey.DeathScreen);
  } else {
    hideGameInterface(GameUiKey.DeathScreen);
  }
}

function playerStateDataHandler(player: PlayerMp, value: CharacterStateType, oldValue?: CharacterStateType) {
  if (player.type != RageEnums.EntityType.PLAYER) return;

  if (player.remoteId === mp.players.local.remoteId) {
    mp.gui.chat.push(`Player state changed to: ${value}`);
    switch (value) {
      case CharacterStateType.WOUNDED:
        toggleDeathScreen(true);
        break;
      case CharacterStateType.DEAD:
        if (!isDeathScreenActive) {
          toggleDeathScreen(true);
        } else {
          // todo update ui
        }
        break;

      default:
        if (isDeathScreenActive)
          toggleDeathScreen(false);
        break;
    }
  }
}

mp.events.addDataHandler(PlayerSharedDataType.State, playerStateDataHandler);
