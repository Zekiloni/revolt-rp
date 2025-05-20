import { AnimationFlag, PlayerSharedDataType } from '@revolt-rp/common';
import { isPlayingAnimation, playAnimation, stopAnimation } from '../util/player-animation.util';


async function isPlayerCuffedDataHandler(player: PlayerMp, value: boolean, oldValue: boolean | undefined) {
  if (player.type !== RageEnums.EntityType.PLAYER) {
    return;
  }

  if (value !== oldValue) {
    if (value) {
      await playAnimation(player, 'mp_arresting', 'idle', AnimationFlag.REPEAT | AnimationFlag.STOP_LAST_FRAME, -1, true);
      player.setEnableHandcuffs(true);
    } else {
      player.setEnableHandcuffs(false);

      if (isPlayingAnimation(player, 'mp_arresting', 'idle'))
        stopAnimation(player, 'mp_arresting', 'idle');
    }
  }
}

mp.events.addDataHandler(PlayerSharedDataType.IsCuffed, isPlayerCuffedDataHandler);
