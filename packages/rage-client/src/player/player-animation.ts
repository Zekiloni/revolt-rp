import { IPlayerAnimation, PlayerSharedDataType } from '@bcrp-rage/common';
import { isPlayingAnimation, playAnimation, stopAnimation } from './util/player-animation.util';

type AnimationData = IPlayerAnimation | null | undefined;

let checkAnimationTime: NodeJS.Timer | null = null;

export const getAnimation = (target: PlayerMp | PedMp) =>
  target.getVariable(PlayerSharedDataType.Animation);

const isPlayerOrPed = (entity: EntityMp) =>
  entity.type === RageEnums.EntityType.PLAYER || entity.type === RageEnums.EntityType.PED;


async function handleAnimationChange(entity: EntityMp, value: AnimationData, oldValue: AnimationData) {
  if (isPlayerOrPed(entity)) {
    if (value && typeof value == 'object') {
      await playAnimation(<PlayerMp>entity, value.dictionary, value.name, value.flag, value.duration);
      if (entity.id === mp.players.local.id) {
        checkAnimationTime = setInterval(async () => {
          if (isPlayingAnimation(<PlayerMp>entity, value.dictionary, value.name) == false) {
            clearInterval(checkAnimationTime);
          }
        }, 1000);
      }
    } else if (value == null && oldValue && typeof oldValue == 'object') {
      stopAnimation(<PlayerMp>entity, oldValue.dictionary, oldValue.name);
    }
  }
}


async function entityStreamInAnimationHandler(entity: EntityMp) {
  if (isPlayerOrPed(entity)) {
    const animation = getAnimation((<PlayerMp | PedMp>entity));
    if (animation && typeof animation == 'object') {
      await playAnimation(<PlayerMp>entity, animation.dictionary, animation.name, animation.flag, animation.duration);
    }
  }
}

mp.events.addDataHandler(PlayerSharedDataType.Animation, handleAnimationChange);
mp.events.add({
  entityStreamIn: entityStreamInAnimationHandler
});
