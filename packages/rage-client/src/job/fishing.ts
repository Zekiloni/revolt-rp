// List of banned materials that we should not detect
// (for example if you want to void pools)
// https://wiki.rage.mp/wiki/Raycast_Materials
import { hideGameInterface, showGameInterface, triggerBrowser } from '../core/browser';
import { AnimationFlag, GameUiKey, PlayerAttachmentTypeEnum, ProcedureKey, rgbColors } from '@revolt-rp/common';
import { getPlayerAttachmentObjects, hasPlayerAttachment } from '../player/inventory/player-attachment';
import { on } from '@libertymp/rage-rpc';
import { isPlayingAnimation, playAnimation } from '../player/util/player-animation.util';

const bannedMaterials = [
  1187676648,
  1945073303,
  1639053622,
  3108646581,
  765206029,
  2128369009
];

/**
 * Find water in front of the player
 * @param inFront Distance in front of the player to check
 * @param range Vertical range to check for water
 * @returns The position of the water/raycast hit or null if not found
 */
function findWaterInFrontOfPlayer(inFront = 5.0, range = -25.0): Vector3 | null {
  const newPos = mp.players.local.getOffsetFromInWorldCoords(0.0, inFront, 0.0);
  const endPos = mp.players.local.getOffsetFromInWorldCoords(0.0, inFront, range);

  const target = mp.raycasting.testCapsule(newPos, endPos, 0.1, mp.players.local, 1);
  if (!target) return null;

  if (typeof target.entity === 'number' && target.entity !== 0 && mp.game.entity.isAnObject(target.entity)) {
    mp.game.shapetest.releaseScriptGuidFromEntity(target.entity);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (!target || bannedMaterials.includes(target.material))
    return null;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const waterZ = mp.game.water.testVerticalProbeAgainstAllWater(target.position.x, target.position.y, mp.players.local.position.z, 1, 1);
  if (!waterZ) return null;

  if (Math.abs(waterZ - target.position.z) < 0.6) return;

  return new mp.Vector3(target.position.x, target.position.y, waterZ);
}


let isFishing = false;
let fishCatchTimeout = null;
let simulateTension = false;
let lastUpdateAt = 0;
let depth = 0;
let distance = 0;
const MIN_TIME_SCHEDULE = 40 * 1000;
const MAX_TIME_SCHEDULE = 80 * 1000;

let fishingRope: number | null = null;
let fishingFloat: ObjectMp | null = null;

const isHoldingFishingRod = (player: PlayerMp) => {
  return hasPlayerAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01);
};

const getPlayerFishingRodAttachment = (player: PlayerMp) => {
  if (!hasPlayerAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01)) {
    return null;
  }

  return getPlayerAttachmentObjects(player, PlayerAttachmentTypeEnum.HoldFishingRod01)[0];
};

function fishingHandler() {
  if (!fishingFloat) return;

  const { x, y, z } = fishingFloat.position;
  // Debug marker
  mp.game.graphics.drawMarker(
    0,
    x, y, z + 1.7,
    0, 0, 0,
    0, 0, 0,
    0.75, 0.75, 0.75,
    rgbColors.SUN_GLOW_GECKO[0], rgbColors.SUN_GLOW_GECKO[1], rgbColors.SUN_GLOW_GECKO[2], 200,
    true, false, 2,
    false, null, null, false
  );

  if (Date.now() - lastUpdateAt < 200) return;
  lastUpdateAt = Date.now();

  let floatSignal = mp.game.water.getWaterHeight(x, y, z);
  let tensionSignal = 0;

  if (simulateTension) {
    tensionSignal = Math.floor(Math.random() * 76);
    floatSignal += tensionSignal - Math.floor(Math.random() * 50);
  }

  triggerBrowser(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, {
    floatSignal,
    tensionSignal,
    distance,
    depth
  });
}

async function startFishing() {
  if (isFishing) {
    return;
  }

  const waterPos = findWaterInFrontOfPlayer(5.0, -25.0);
  if (!waterPos) {
    mp.gui.chat.push('No water found!');
    return;
  }

  isFishing = true;
  mp.players.local.freezePosition(true);

  // Play casting animation
  mp.game.streaming.requestAnimDict('mini@tennis');
  while (!mp.game.streaming.hasAnimDictLoaded('mini@tennis')) await mp.game.waitAsync(100);

  await playAnimation(mp.players.local, 'mini@tennis', 'forehand_ts_md_far', AnimationFlag.UPPER_BODY_ONLY_CONTROLLABLE, 1000);

  while (isPlayingAnimation(mp.players.local, 'mini@tennis', 'forehand_ts_md_far')) {
    await mp.game.waitAsync(0);
  }

  // Play idle fishing animation
  await playAnimation(mp.players.local, 'amb@world_human_stand_fishing@idle_a', 'idle_c', AnimationFlag.STOP_LAST_FRAME | AnimationFlag.NOT_INTERRUPTABLE);

  distance = Math.random() * (21.5 - 13) + 13;
  depth = Math.random() * (5 - 1) + 1;

  const floatPosition = mp.players.local.getOffsetFromInWorldCoords(0, distance, -(depth / 5));

  fishingFloat = mp.objects.new(
    mp.game.joaat('prop_tennis_ball'),
    floatPosition,
    {
      rotation: new mp.Vector3(0, 0, 0),
      alpha: 255,
      dimension: mp.players.local.dimension
    }
  );

  const fishingRodObject = getPlayerFishingRodAttachment(mp.players.local);

  while (fishingFloat.handle === 0) {
    await mp.game.waitAsync(100);
  }

  setTimeout(() => {
    if (!fishingFloat || !fishingRodObject) return;

    fishingFloat.setPhysicsParams(1.0, 1.2, 1.0, 1.0, 10, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0);
    fishingFloat.setActivatePhysicsAsSoonAsItIsUnfrozen(true);

    // Get fishing rod tip position (offset from rod object)
    const fishingRodTip = fishingRodObject.getOffsetFromInWorldCoords(0, 0, 2.4);

    // Calculate distance between rod tip and float
    const dist = Math.abs(fishingRodTip.x - fishingFloat.position.x) +
      Math.abs(fishingRodTip.y - fishingFloat.position.y) +
      Math.abs(fishingRodTip.z - fishingFloat.position.z);

    mp.game.invoke(RageEnums.Natives.PHYSICS.ROPE_LOAD_TEXTURES);


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fishingRope = mp.game.rope.addRope(fishingRodTip.x, fishingRodTip.y, fishingRodTip.z, 0, 0, 0, dist, 5, dist, 0.1, 0.9, false, false, false, 1.0, false, 0).result;
    fishingFloat.freezePosition(false);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mp.game.rope.attachEntitiesToRope(fishingRope, fishingRodObject.handle, fishingFloat.handle, fishingRodTip.x, fishingRodTip.y, fishingRodTip.z, fishingFloat.position.x, fishingFloat.position.y, fishingFloat.position.z, dist, false, false, 0, 0);
  }, 500);

  showGameInterface(GameUiKey.FishingMinigame);

  mp.events.add('render', fishingHandler);

  function scheduleFishing() {
    const delay = Math.random() * (MAX_TIME_SCHEDULE - MIN_TIME_SCHEDULE) + MIN_TIME_SCHEDULE;
    fishCatchTimeout = setTimeout(() => {
      if (!simulateTension) {
        const chance = Math.random();
        if (chance < 0.5) {
          simulateTension = true;
        }
      }
      scheduleFishing();
    }, delay);
  }

  scheduleFishing();
}

function stopFishing() {
  if (fishCatchTimeout) {
    clearTimeout(fishCatchTimeout);
    fishCatchTimeout = null;
  }

  hideGameInterface(GameUiKey.FishingMinigame);
  isFishing = false;
  simulateTension = false;

  mp.players.local.clearTasks();
  mp.players.local.freezePosition(false);
  mp.events.remove('render', fishingHandler);

  if (fishingRope) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    if (fishingFloat && mp.objects.exists(fishingFloat))
      fishingFloat.destroy();

    if (fishingRope) {
      mp.game.rope.detachRopeFromEntity(fishingRope, fishingFloat.handle);
      mp.game.rope.deleteRope(fishingRope);
    }

    fishingRope = null;
  }
}


on(ProcedureKey.CLIENT_USE_FISHING_ROD, startFishing);
on(ProcedureKey.CLIENT_STOP_FISHING, stopFishing);
