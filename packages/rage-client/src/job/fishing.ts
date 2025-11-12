// List of banned materials that we should not detect
// (for example if you want to void pools)
// https://wiki.rage.mp/wiki/Raycast_Materials
import { hideGameInterface, showGameInterface, triggerBrowser } from '../core/browser';
import {
  AnimationFlag,
  GameUiKey,
  HexKeyCodes,
  PlayerAttachmentTypeEnum,
  ProcedureKey,
  rgbColors
} from '@revolt-rp/common';
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
let hasFishBitten = false;
let fishCatchTimeout = null;
let lastUpdateAt = 0;
let depth = 0;
let distance = 0;
let lineTension = 0;
let reelWindow = 0;

// Game constants
const TENSION_RISE_RATE = 0.2; // % per tick when not at 100% reel
const TENSION_FALL_RATE = 1.2; // % per tick when at 100% reel
const REEL_DECAY_RATE = 1.5; // % per tick
const REEL_SPACE_BOOST = 3.5; // % per space press
const REEL_SPACE_PENALTY = 1.0; // Extra decay if spamming over 100%
const FLOAT_PULL_SPEED = 0.8; // Velocity multiplier when pulling
const TICK_INTERVAL = 50; // ms between ticks
const MIN_TIME_SCHEDULE = 40 * 1000;
const MAX_TIME_SCHEDULE = 80 * 1000;

const fishes: PedMp[] = [];
let fishingRope: number | null = null;
let fishingFloat: ObjectMp | null = null;
let gameLoopInterval: NodeJS.Timer | null = null;
let initialDistance = 0;

const isHoldingFishingRod = (player: PlayerMp) => {
  return hasPlayerAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01);
};

const getPlayerFishingRodAttachment = (player: PlayerMp) => {
  if (!hasPlayerAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01)) {
    return null;
  }

  return getPlayerAttachmentObjects(player, PlayerAttachmentTypeEnum.HoldFishingRod01)[0];
};

async function spawnFishInArea(center: Vector3, radius: number, count: number) {
  for (let i = 0; i < count; i++) {
    const offsetX = (Math.random() - 0.5) * radius;
    const offsetY = (Math.random() - 0.5) * radius;
    const waterZ = mp.game.water.getWaterHeight(center.x + offsetX, center.y + offsetY, center.z);

    if (!waterZ) continue;

    const fishPed = mp.peds.new(
      mp.game.joaat('a_c_fish'),
      new mp.Vector3(center.x + offsetX, center.y + offsetY, waterZ - 2.0),
      0,
      mp.players.local.dimension
    );

    while (fishPed.handle === 0) {
      await mp.game.waitAsync(0);
    }

    fishPed.freezePosition(false);

    if (fishPed.isSwimmingUnderWater()) {
      fishPed.taskWanderInArea(center.x, center.y, waterZ, radius, 10.0, 1.0);
    }

    fishes.push(fishPed);
  }
}

function gameLoop() {
  if (!isFishing || !fishingFloat) return;

  if (!hasFishBitten)
    return;

  // Calculate current distance from float to player
  const fishingRodObject = getPlayerFishingRodAttachment(mp.players.local);
  if (fishingRodObject) {
    const rodTip = fishingRodObject.getOffsetFromInWorldCoords(0, 0, 2.4);
    const floatPos = fishingFloat.position;
    distance = Math.sqrt(
      Math.pow(rodTip.x - floatPos.x, 2) +
      Math.pow(rodTip.y - floatPos.y, 2) +
      Math.pow(rodTip.z - floatPos.z, 2)
    );
  }

  // Reel Window decays constantly
  reelWindow -= REEL_DECAY_RATE;
  if (reelWindow < 0) reelWindow = 0;

  // If Reel Window is at 100%, reduce tension and pull float
  if (reelWindow >= 100) {
    lineTension -= TENSION_FALL_RATE;
    if (lineTension < 0) lineTension = 0;

    // Pull float towards player
    if (fishingRodObject && fishingFloat) {
      const rodTip = fishingRodObject.getOffsetFromInWorldCoords(0, 0, 2.4);
      const floatPos = fishingFloat.position;

      // Calculate direction vector
      const dx = rodTip.x - floatPos.x;
      const dy = rodTip.y - floatPos.y;
      const dz = rodTip.z - floatPos.z;

      // Normalize and apply velocity
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > 0.5) {
        const normalizedX = (dx / dist) * FLOAT_PULL_SPEED;
        const normalizedY = (dy / dist) * FLOAT_PULL_SPEED;
        const normalizedZ = (dz / dist) * FLOAT_PULL_SPEED;

        fishingFloat.setVelocity(normalizedX, normalizedY, normalizedZ);
      }
    }
  } else {
    // If not at 100%, tension rises
    lineTension += TENSION_RISE_RATE;
    if (lineTension > 100) lineTension = 100;
  }

  // Check win condition: tension reached 0
  if (lineTension <= 0) {
    stopFishing(true);
    return;
  }

  // Check lose condition: tension maxed out
  if (lineTension >= 100) {
    stopFishing();
    return;
  }
}

let lastSpacePress = 0;
const SPACE_PRESS_COOLDOWN = 100; // ms between space presses

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

  // Check for space press every frame
  if (mp.keys.isDown(HexKeyCodes.Space)) {
    const now = Date.now();
    if (now - lastSpacePress >= SPACE_PRESS_COOLDOWN) {
      lastSpacePress = now;

      // Increase reel window
      reelWindow += REEL_SPACE_BOOST;

      // Penalty if over 100% (spamming too fast)
      if (reelWindow > 100) {
        reelWindow = 100 + REEL_SPACE_PENALTY;
      }
    }
  }

  if (Date.now() - lastUpdateAt < 200) return;
  lastUpdateAt = Date.now();

  const floatSignal = mp.game.water.getWaterHeight(x, y, z);

  triggerBrowser(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, {
    floatSignal,
    tensionSignal: lineTension,
    reelWindow,
    distance,
    depth
  });
}

// Handle space bar press
function handleSpacePress(key: number) {
  if (key !== 32) return; // 32 = Space key code
  if (!isFishing) return;

  // Increase reel window
  reelWindow += REEL_SPACE_BOOST;

  // Penalty if over 100% (spamming too fast)
  if (reelWindow > 100) {
    reelWindow = 100 + REEL_SPACE_PENALTY;
  }
}

mp.keys.bind(32, true, handleSpacePress);

async function startFishing() {
  if (isFishing) {
    return;
  }

  const waterPos = findWaterInFrontOfPlayer(5.0, -25.0);
  if (!waterPos) {
    return;
  }

  await spawnFishInArea(waterPos, 10.0, 5);

  await playAnimation(mp.players.local, 'mini@tennis', 'forehand_ts_md_far', AnimationFlag.UPPER_BODY_ONLY_CONTROLLABLE, 1000);

  while (isPlayingAnimation(mp.players.local, 'mini@tennis', 'forehand_ts_md_far')) {
    await mp.game.waitAsync(0);
  }

  // Play idle fishing animation
  await playAnimation(mp.players.local, 'amb@world_human_stand_fishing@idle_a', 'idle_c', AnimationFlag.STOP_LAST_FRAME | AnimationFlag.NOT_INTERRUPTABLE);

  mp.players.local.freezePosition(true);
  isFishing = true;

  initialDistance = Math.random() * (21.5 - 13) + 13;
  distance = initialDistance;
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

  // Initialize game state
  lineTension = 0;
  reelWindow = 0;

  // Start game loop
  gameLoopInterval = setInterval(gameLoop, TICK_INTERVAL);

  function scheduleFishing() {
    const delay = Math.random() * (MAX_TIME_SCHEDULE - MIN_TIME_SCHEDULE) + MIN_TIME_SCHEDULE;
    fishCatchTimeout = setTimeout(() => {
      const chance = Math.random();
      if (chance < 0.7) {
        hasFishBitten = true;
        lineTension = 20; // Start with some initial tension
      }

      scheduleFishing();
    }, delay);
  }

  scheduleFishing();
}

function stopFishing(isCatch = false) {
  if (fishCatchTimeout) {
    clearTimeout(fishCatchTimeout);
    fishCatchTimeout = null;
  }

  if (gameLoopInterval) {
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;
  }

  hideGameInterface(GameUiKey.FishingMinigame);
  isFishing = false;
  hasFishBitten = false;

  mp.players.local.clearTasks();
  mp.players.local.freezePosition(false);
  mp.events.remove('render', fishingHandler);

  if (isCatch) {
    mp.gui.chat.push('🎣 Fish caught successfully!');
    // Call server to give reward
  } else {
    mp.gui.chat.push('❌ The fish got away...');
  }

  fishes.forEach(fish => {
    if (mp.peds.exists(fish)) {
      fish.destroy();
    }
  });

  if (fishingRope) {
    if (fishingFloat && mp.objects.exists(fishingFloat)) {
      mp.game.rope.detachRopeFromEntity(fishingRope, fishingFloat.handle);
    }
    mp.game.rope.deleteRope(fishingRope);
    fishingRope = null;
  }

  if (fishingFloat && mp.objects.exists(fishingFloat)) {
    fishingFloat.destroy();
    fishingFloat = null;
  }

  // Reset game state
  lineTension = 0;
  reelWindow = 0;
  distance = 0;
  lastSpacePress = 0;
}

on(ProcedureKey.CLIENT_USE_FISHING_ROD, startFishing);
on(ProcedureKey.CLIENT_STOP_FISHING, stopFishing);
