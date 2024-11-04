import { AnimationFlag } from '@bcrp-rage/common';


export function loadAnimDictionary(animationDictionary: string): Promise<boolean> {
  if (mp.game.streaming.hasAnimDictLoaded(animationDictionary))
    return Promise.resolve(true);

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {
    if (mp.game.streaming.doesAnimDictExist(animationDictionary)) {
      resolve(false);
    }

    mp.game.streaming.requestAnimDict(animationDictionary);
    while (!mp.game.streaming.hasAnimDictLoaded(animationDictionary)) {
      await mp.game.waitAsync(0);
    }
    resolve(true);
  });
}


export async function playAnimation(
  entity: PlayerMp | PedMp,
  dict: string,
  name: string,
  flag: AnimationFlag = AnimationFlag.CANCELABLE,
  duration = -1,
  allowDead?: boolean
): Promise<void> {
  if (entity.type == RageEnums.EntityType.PLAYER && (<PlayerMp>entity).vehicle) {
    return;
  }

  const isAnimLoaded = await loadAnimDictionary(dict);

  if (!isAnimLoaded) {
    return;
  }

  if (mp.players.local.isPlayingAnim(dict, name, AnimationFlag.REPEAT)) {
    return;
  }

  entity.taskPlayAnim(dict, name, 8.0, -1, duration, flag, 0, false, false, false);
}


export function stopAnimation(entity: EntityMp, dictionary: string, name: string) {
  entity.stopAnim(dictionary, name, 1);
}


export function isAnimationFinished(entity: EntityMp, dictionary: string, name: string) {
  return entity.hasAnimFinished(dictionary, name, 3);
}

export function isPlayingAnimation(entity: EntityMp, dictionary: string, name: string) {
  const animTime = entity.getAnimCurrentTime(dictionary, name);
  return animTime < 0.95 && animTime > 0.1;
}
