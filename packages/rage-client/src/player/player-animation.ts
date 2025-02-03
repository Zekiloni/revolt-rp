import { IPlayerAnimation, PlayerSharedDataType } from '@revolt-rp/common';
import { playAnimation, setPlayerWalkingStyle, stopAnimation } from './util/player-animation.util';

type AnimationData = IPlayerAnimation | null | undefined;

export const getAnimation = (target: PlayerMp | PedMp) =>
  target.getVariable(PlayerSharedDataType.Animation);

const isPlayerOrPed = (entity: EntityMp) =>
  entity.type === RageEnums.EntityType.PLAYER || entity.type === RageEnums.EntityType.PED;


async function playerAnimationChangeHandler(entity: EntityMp, value: AnimationData, oldValue: AnimationData) {
  if (isPlayerOrPed(entity)) {
    if (value && typeof value == 'object') {
      await playAnimation(<PlayerMp>entity, value.dictionary, value.name, value.flag, value.duration);
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

async function playerWalkingStyleChangeHandler(player: PlayerMp, value: string | null, oldValue?: string | null) {
  if (isPlayerOrPed(player)) {
    if (value) {
      await setPlayerWalkingStyle(player, value);
    }
  }
}

mp.events.addDataHandler(PlayerSharedDataType.Animation, playerAnimationChangeHandler);
mp.events.addDataHandler(PlayerSharedDataType.WalkingStyle, playerWalkingStyleChangeHandler);
mp.events.add({
  entityStreamIn: entityStreamInAnimationHandler,
});
