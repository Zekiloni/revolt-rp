import { on } from '@libertymp/rage-rpc';
import { AddictionType, ProcedureKey } from '@revolt-rp/common';


/**
 * "HAND_SHAKE"
 * "SMALL_EXPLOSION_SHAKE"
 * "MEDIUM_EXPLOSION_SHAKE"
 * "LARGE_EXPLOSION_SHAKE"
 * "JOLT_SHAKE"
 * "ROAD_VIBRATION_SHAKE"
 * "DRUNK_SHAKE"
 * "VIBRATE_SHAKE"
 */
interface IDrugVisualEffect {
  screenEffect?: string;
  shake?: {
    type: string;
    intensity?: number;
  };
  motionBlur?: {
    enabled: boolean;
    strength?: number;
  };
}

const mainCamera = mp.cameras.new('gameplay');
let effectClearTimeout: NodeJS.Timeout | null = null;

const AddictionEffects: Partial<Record<AddictionType, IDrugVisualEffect>> = {
  [AddictionType.Cannabis]: {
    screenEffect: 'DrugsTrevorClownsFight',
    shake: { type: 'DRUNK_SHAKE', intensity: 0.3 },
    motionBlur: { enabled: true, strength: 0.25 }
  },
  [AddictionType.Heroin]: {
    screenEffect: 'DrugsDrivingIn',
    shake: { type: 'DRUNK_SHAKE', intensity: 0.4 }
  },
  [AddictionType.Acid]: {
    screenEffect: 'DMT_flight',
    shake: { type: 'DRUNK_SHAKE', intensity: 0.6 },
    motionBlur: { enabled: true, strength: 0.5 }
  },
  [AddictionType.Ecstasy]: {
    screenEffect: 'BikerFilter',
    shake: { type: 'DRUNK_SHAKE', intensity: 0.5 },
    motionBlur: { enabled: true, strength: 0.35 }
  },
  [AddictionType.PCP]: {
    screenEffect: 'DeathFailMPIn',
    shake: { type: 'VIBRATE_SHAKE', intensity: 0.6 }
  },
  [AddictionType.Shrooms]: {
    screenEffect: 'DMT_flight',
    shake: { type: 'DRUNK_SHAKE', intensity: 0.5 },
    motionBlur: { enabled: true, strength: 0.5 }
  }
  // Add other drugs as needed
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
