import { ProcedureKey } from '@revolt-rp/common';
import { on } from '@libertymp/rage-rpc';
import { greenScreenConfig } from './util/green-screen/green-screen.config';
import {
  loadComponentVariation,
  resetPedComponents,
  takeClothingComponentScreenshot
} from './util/green-screen/clothing-screenshot.util';
import { takeObjectScreenshot } from './util/green-screen/object-screenshot.util';


let interval: NodeJS.Timeout;
let object: ObjectMp | null = null;
let isTakingScreenshot = false;
const modelScreenshots: Set<string>= new Set();

async function screenShotClothingHandler(type: 'CLOTHING' | 'PROP') {
  if (isTakingScreenshot) {
    clearInterval(interval);
    mp.players.local.freezePosition(false);
    isTakingScreenshot = false;
    return;
  }

  isTakingScreenshot = true;
  const pedType = mp.players.local.model === RageEnums.Ped.Hash.MP_M_FREEMODE_01 ? 'mp_m_freemode_01' : 'mp_f_freemode_01';

  mp.game.cam.invalidateIdle();

  interval = setInterval(() => {
    mp.players.local.clearTasksImmediately();
  }, 10);

  mp.players.local.setRotation(greenScreenConfig.greenScreenRotation.x, greenScreenConfig.greenScreenRotation.y, greenScreenConfig.greenScreenRotation.z, 0, false);
  mp.players.local.setCoordsNoOffset(greenScreenConfig.greenScreenPosition.x, greenScreenConfig.greenScreenPosition.y, greenScreenConfig.greenScreenPosition.z, false, false, false);
  mp.players.local.freezePosition(true);
  await mp.game.waitAsync(50);
  mp.game.player.setControl(true, 0);

  for (const component of Object.keys(greenScreenConfig.cameraSettings[type])) {
    await resetPedComponents();
    const drawableVariations = mp.players.local.getNumberOfDrawableVariations(parseInt(component));
    for (let drawable = 0; drawable < drawableVariations; drawable++) {
      const textureVariations = mp.players.local.getNumberOfTextureVariations(parseInt(component), drawable);
      if (textureVariations === 0) {
        await loadComponentVariation(parseInt(component), drawable, 0);
        await takeClothingComponentScreenshot(pedType, type, parseInt(component), drawable, 0);
      } else {
        for (let texture = 0; texture < textureVariations; texture++) {
          await loadComponentVariation(parseInt(component), drawable, texture);
          await takeClothingComponentScreenshot(pedType, type, parseInt(component), drawable, 0);
        }
      }
    }
  }

  clearInterval(interval);
}

async function screenShotObjectsHandler(models: string[]) {
  mp.game.cam.invalidateIdle();

  mp.players.local.setCoords(greenScreenConfig.greenScreenHiddenSpot.x, greenScreenConfig.greenScreenHiddenSpot.y, greenScreenConfig.greenScreenHiddenSpot.z, false, false, false, false);
  mp.players.local.freezePosition(true);

  await mp.game.waitAsync(100);

  for (const model of models) {
    if (modelScreenshots.has(model)) {
      continue;
    }

    const modelHash = mp.game.joaat(model);
    if (!mp.game.streaming.isModelValid(modelHash)) {
      continue;
    }

    if (object && mp.objects.exists(object)) {
      object.destroy();
    }

    object = mp.objects.new(modelHash, new mp.Vector3(greenScreenConfig.greenScreenPosition.x, greenScreenConfig.greenScreenPosition.y, greenScreenConfig.greenScreenPosition.z), {
      rotation: new mp.Vector3(greenScreenConfig.greenScreenRotation.x, greenScreenConfig.greenScreenRotation.y, greenScreenConfig.greenScreenRotation.z)
    });

    object.freezePosition(true);

    while (object.handle === 0) {
      await mp.game.waitAsync(50);
    }

    await takeObjectScreenshot(object, model);
    modelScreenshots.add(model);
  }

  mp.players.local.freezePosition(false);

}

on(ProcedureKey.CLIENT_SCREENSHOT_CLOTHING, screenShotClothingHandler);
on(ProcedureKey.CLIENT_SCREENSHOT_ITEM_OBJECTS, screenShotObjectsHandler);
