// List of banned materials that we should not detect
// (for example if you want to void pools)
// https://wiki.rage.mp/wiki/Raycast_Materials
import { hideGameInterface, showGameInterface, triggerBrowser } from '../core/browser';
import { AnimationFlag, GameUiKey, PlayerAttachmentTypeEnum, ProcedureKey, rgbColors } from '@revolt-rp/common';
import { getPlayerAttachmentObjects, hasPlayerAttachment } from '../player/inventory/player-attachment';
import { on } from '@libertymp/rage-rpc';
import { playAnimation } from '../player/util/player-animation.util';

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


// TODO: Implement fishing job using the findWaterInFrontOfPlayer function to detect water bodies
// Start fishing when the player uses the fishing rod item near water
// Handle fishing mini-game and rewards
// Send updates to the server about fishing progress and caught fish


let inMinigame = false;
let fishingTimer = null;
const MIN_TIME_SCHEDULE = 40 * 1000;
const MAX_TIME_SCHEDULE = 80 * 1000;
const MINIGAME_TIMEOUT_MS = 7.5 * 1000;

const fishingFloatObjects: ObjectMp[] = [];

const isHoldingFishingRod = (player: PlayerMp) => {
  return hasPlayerAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01);
};

const getPlayerFishingRodAttachment = (player: PlayerMp) => {
  if (!hasPlayerAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01)) {
    return null;
  }

  return getPlayerAttachmentObjects(player, PlayerAttachmentTypeEnum.HoldFishingRod01)[0];
};

async function startFishing() {
  if (inMinigame) {
    return;
  }

  const waterPos = findWaterInFrontOfPlayer(5.0, -25.0);
  if (!waterPos) {
    mp.gui.chat.push('No water found!');
    return;
  }

  mp.players.local.freezePosition(true);

  // Play casting animation
  mp.game.streaming.requestAnimDict('mini@tennis');
  while (!mp.game.streaming.hasAnimDictLoaded('mini@tennis')) await mp.game.waitAsync(100);

  await playAnimation(mp.players.local, 'mini@tennis', 'forehand_ts_md_far', AnimationFlag.UPPER_BODY_ONLY, 1000);
  await mp.game.waitAsync(700);

  // Play idle fishing animation
  await playAnimation(mp.players.local, 'amb@world_human_stand_fishing@idle_a', 'idle_c', AnimationFlag.STOP_LAST_FRAME | AnimationFlag.NOT_INTERRUPTABLE, -1);

  const randomDistance = Math.random() * (21.5 - 13) + 13;
  const randomDepth = Math.random() * (5 - 1) + 1;

  const floatPosition = mp.players.local.getOffsetFromInWorldCoords(0, randomDistance, -(randomDepth / 5));

  const fishingFloat = mp.objects.new(
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
    const fishingRope = mp.game.rope.addRope(fishingRodTip.x, fishingRodTip.y, fishingRodTip.z, 0, 0, 0, dist, 5, dist, 0.1, 0.9, false, false, false, 1.0, false, 0);
    fishingFloat.freezePosition(false);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mp.game.rope.attachEntitiesToRope(fishingRope.result, fishingRodObject.handle, fishingFloat.handle, fishingRodTip.x, fishingRodTip.y, fishingRodTip.z, fishingFloat.position.x, fishingFloat.position.y, fishingFloat.position.z, dist, false, false, 0, 0);
  }, 500);

  showGameInterface(GameUiKey.FishingMinigame);

  // Setup render loop for water level updates
  mp.events.add('render', () => {
    if (!fishingFloat) return;

    const waterLevel = mp.game.water.getWaterHeight(floatPosition.x, floatPosition.y, floatPosition.z);

    // Debug marker
    mp.game.graphics.drawMarker(
      0,
      fishingFloat.position.x, fishingFloat.position.y, fishingFloat.position.z + 1.7,
      0, 0, 0,
      0, 0, 0,
      0.75, 0.75, 0.75,
      rgbColors.SUN_GLOW_GECKO[0], rgbColors.SUN_GLOW_GECKO[1], rgbColors.SUN_GLOW_GECKO[2], 200,
      true, false, 2,
      false, null, null, false
    );

    triggerBrowser(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, {
      waterLevel,
      distance: randomDistance,
      depth: randomDepth
    });
  });

  scheduleNextFishing();
}

function stopFishing() {
  if (fishingTimer) {
    clearTimeout(fishingTimer);
    fishingTimer = null;
  }

  hideGameInterface(GameUiKey.FishingMinigame);
  inMinigame = false;
}

function startFishingMinigame() {
  if (!isHoldingFishingRod(mp.players.local)) {
    return;
  }

  inMinigame = true;

  // const diifficulty = Math.random(); // TODO: Determine difficulty based on conditions
  // setTimeout(async () => {
  //   const success = await callBrowser<boolean>(ProcedureKey.BROWSER_FISHING_MINIGAME_START, null, { timeout: MINIGAME_TIMEOUT_MS });
  //   if (success) {
  //     mp.events.call('fishing:minigame:success');
  //   } else {
  //     mp.events.call('fishing:minigame:failure');
  //   }
  // }, 500);
}


function scheduleNextFishing() {
  const delay = Math.random() * (MAX_TIME_SCHEDULE - MIN_TIME_SCHEDULE) + MIN_TIME_SCHEDULE;
  fishingTimer = setTimeout(() => {
    if (!inMinigame) {
      mp.gui.chat.push('A fish is biting!');
      // 50% chance to start fishing minigame
      const chance = Math.random();
      mp.gui.chat.push('Chance: ' + chance);
      if (chance < 0.5)
        startFishingMinigame();
    }
    scheduleNextFishing();
  }, delay);
}

on(ProcedureKey.CLIENT_USE_FISHING_ROD, startFishing);
