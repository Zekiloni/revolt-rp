import { on } from '@libertymp/rage-rpc';
import { AddictionType, ProcedureKey } from '@revolt-rp/common';


interface IDrugVisualEffect {
  screenEffect?: string;
  shake?: {
    type: RageEnums.GamePlayCam.Shake;
    intensity?: number;
  };
  motionBlur?: {
    enabled: boolean;
    strength?: number;
  };
}

const mainCamera = mp.cameras.new('gameplay');
let effectClearTimeout: NodeJS.Timeout | null = null;

export const AddictionEffects: Partial<Record<AddictionType, IDrugVisualEffect>> = {
  [AddictionType.Cannabis]: {
    screenEffect: "DrugsTrevorClownsFight",
    shake: { type: RageEnums.GamePlayCam.Shake.DRUNK_SHAKE, intensity: 0.3 },
    motionBlur: { enabled: true, strength: 0.25 }
  },

  [AddictionType.Heroin]: {
    screenEffect: "DrugsDrivingIn",
    shake: { type: RageEnums.GamePlayCam.Shake.DRUNK_SHAKE, intensity: 0.4 }
  },

  [AddictionType.Acid]: {
    screenEffect: "DMT_flight",
    shake: { type: RageEnums.GamePlayCam.Shake.DRUNK_SHAKE, intensity: 0.6 },
    motionBlur: { enabled: true, strength: 0.5 }
  },

  [AddictionType.Ecstasy]: {
    screenEffect: "BikerFilter",
    shake: { type: RageEnums.GamePlayCam.Shake.DRUNK_SHAKE, intensity: 0.5 },
    motionBlur: { enabled: true, strength: 0.35 }
  },

  [AddictionType.PCP]: {
    screenEffect: "DeathFailMPIn",
    shake: { type: RageEnums.GamePlayCam.Shake.VIBRATE_SHAKE, intensity: 0.6 }
  },

  [AddictionType.Shrooms]: {
    screenEffect: "DMT_flight",
    shake: { type: RageEnums.GamePlayCam.Shake.DRUNK_SHAKE, intensity: 0.5 },
    motionBlur: { enabled: true, strength: 0.5 }
  }
};


function playerDrugUseHandler(data: [AddictionType, number, number]) {
  const [addictionType, effectLevel, duration] = data;

  const effect = AddictionEffects[addictionType];
  if (!effect) return;

  // Screen effect
  if (effect.screenEffect) {
    mp.game.graphics.startScreenEffect(effect.screenEffect, duration * 1000, false);
  }

  // Camera shake
  if (effect.shake) {
    mp.game.cam.shakeGameplayCam(
      effect.shake.type,
      effect.shake.intensity ?? 0.5
    );
  }

  // Motion blur
  if (effect.motionBlur?.enabled) {
    mp.game.ped.setMotionBlur(mp.players.local.handle, true)
    mainCamera.setMotionBlurStrength(effect.motionBlur.strength ?? 0.3);
  }

  if (effectClearTimeout) {
    clearTimeout(effectClearTimeout);
    effectClearTimeout = null;
  }

  mp.gui.chat.push('~p~[Drug Effect] ~w~You feel the effects of ' + addictionType + ' (Level ' + effectLevel + ') for ' + duration + ' seconds.');
  // Stop after duration
  setTimeout(() => {
    if (effect.screenEffect) mp.game.graphics.stopScreenEffect(effect.screenEffect);
    if (effect.shake) mp.game.cam.stopGameplayCamShaking(true);
    if (effect.motionBlur?.enabled) {
      mp.game.ped.setMotionBlur(mp.players.local.handle, false)
      mainCamera.setMotionBlurStrength(0);
    }

    if (effectClearTimeout) {
      clearTimeout(effectClearTimeout);
      effectClearTimeout = null;
    }
  }, duration * 1000);
}


on(ProcedureKey.CLIENT_DRUG_USE_EFFECT, playerDrugUseHandler);
