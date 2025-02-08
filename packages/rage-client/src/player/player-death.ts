import { GameUiKey, PlayerSharedDataType } from '@revolt-rp/common';
import { hideGameInterface, showGameInterface } from '../core/browser';
import { getIsWounded } from './util/player-data.util';


let isDeathScreenActive = false;
const playerRagdollCheckInterval: Map<number, NodeJS.Timeout> = new Map();

function toggleDeathScreen(toggle: boolean) {
  isDeathScreenActive = toggle;
  if (toggle) {
    showGameInterface(GameUiKey.DeathScreen);
  } else {
    hideGameInterface(GameUiKey.DeathScreen);
  }
}


function clearPlayerRagdollCheck(player: PlayerMp) {
  if (playerRagdollCheckInterval.has(player.remoteId)) {
    clearInterval(playerRagdollCheckInterval.get(player.remoteId));
    playerRagdollCheckInterval.delete(player.remoteId);
  }
}

function setPlayerRagdoll(player: PlayerMp) {
  player.setToRagdoll(5000, 5000, 0, false, false, false);
  player.setRagdollForceFall();
  const interval = setInterval(() => {
    if (player) {
      if (player.isRagdoll) {
        player.setToRagdoll(5000, 5000, 0, false, false, false);
      }
    }
  }, 1000);

  playerRagdollCheckInterval.set(player.remoteId, interval);
}

function playerStateDataHandler(player: PlayerMp, value: boolean, oldValue?: boolean) {
  if (player.type != RageEnums.EntityType.PLAYER) return;

  if (player.remoteId === mp.players.local.remoteId) {
    if (value) {
      if (!isDeathScreenActive)
        toggleDeathScreen(true);
    } else {
      if (isDeathScreenActive)
        toggleDeathScreen(false);

      clearPlayerRagdollCheck(player);
    }
  }

  if (value && oldValue === undefined) {
    setPlayerRagdoll(player);
  }
}


function playerStateStreamInHandler(player: PlayerMp) {
  if (player.type != RageEnums.EntityType.PLAYER) return;

  if (getIsWounded(player) && !player.isDead()) {
    setPlayerRagdoll(player);
  }
}

function playerStateStreamOutHandler(player: PlayerMp) {
  if (player.type != RageEnums.EntityType.PLAYER) return;

  clearPlayerRagdollCheck(player);
}

function playerSpawnHandler(player: PlayerMp) {
  if (player.remoteId === mp.players.local.remoteId) {
    mp.game.gameplay.setFadeOutAfterDeath(false);
  }
}

mp.events.addDataHandler(PlayerSharedDataType.IsWounded, playerStateDataHandler);
mp.events.add({
  playerSpawn: playerSpawnHandler,
  entityStreamIn: playerStateStreamInHandler,
  entityStreamOut: playerStateStreamOutHandler
});
