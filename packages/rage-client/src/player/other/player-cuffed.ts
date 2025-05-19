import { PlayerSharedDataType } from '@revolt-rp/common';


function isPlayerCuffedDataHandler(player: PlayerMp, value: boolean, oldValue: boolean | undefined) {
  if (player.type !== RageEnums.EntityType.PLAYER) {
    return;
  }

  if (value !== oldValue) {
    if (value) {
      player.setEnableHandcuffs(true);
    } else {
      player.setEnableHandcuffs(false);
    }
  }
}

mp.events.addDataHandler(PlayerSharedDataType.IsCuffed, isPlayerCuffedDataHandler);
