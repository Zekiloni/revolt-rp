export const enum AnimationFlags {
   NORMAL = 0,
   REPEAT = 1,
   STOP_LAST_FRAME = 2,
   UPPERBODY_ONLY = 16,
   ENABLE_PLAYER_CONTROL = 32,
   UPPERBODY_ONLY_CONTROLLABLE = 49,
   UPPERBODY_STOP_ON_LAST_FRAME_CONTROLLABLE = 50,
   CANCELABLE = 120
}


export default interface iPlayerAnimation {
   name: string
   dictionary: string
   flag: AnimationFlags
   duration?: number
}

export function loadAnimDictionary(animationDictionary: string): Promise<boolean> {
   if (mp.game.streaming.hasAnimDictLoaded(animationDictionary))
      return Promise.resolve(true);

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
   flag: AnimationFlags = AnimationFlags.CANCELABLE,
   duration: number = -1,
   allowDead?: boolean
): Promise<void> {
   if (entity.type == RageEnums.EntityType.PLAYER && (<PlayerMp>entity).vehicle) {
      return;
   }

   const isAnimLoaded = await loadAnimDictionary(dict);

   if (!isAnimLoaded) {
      return;
   }

   if (mp.players.local.isPlayingAnim(dict, name, AnimationFlags.REPEAT)) {
      return;
   }

   entity.taskPlayAnim(dict, name, 8.0, -1, duration, flag, 0, false, false, false);
}


export function stopAnimation(entity: EntityMp, dictionary: string, name: string) {
   entity.stopAnim(dictionary, name, 1);
}


export function isAnimationFinished (entity: EntityMp, dictionary: string, name: string) {
   return entity.hasAnimFinished(dictionary, name, 3);
}

export function isPlayingAnimation(entity: EntityMp, dictionary: string, name: string) {
   const animTime = entity.getAnimCurrentTime(dictionary,name);
   return animTime < 0.95 && animTime > 0.1;
}
