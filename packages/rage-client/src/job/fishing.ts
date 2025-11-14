// List of banned materials that we should not detect
// (for example if you want to void pools)
// https://wiki.rage.mp/wiki/Raycast_Materials
import { hideGameInterface, isGameInterfaceActive, showGameInterface, triggerBrowser } from '../core/browser';
import {
  AnimationFlag,
  GameUiKey,
  HexKeyCodes,
  PlayerAttachmentTypeEnum,
  PlayerSharedDataType,
  ProcedureKey,
  rgbColors
} from '@revolt-rp/common';
import { getPlayerAttachmentObjects, hasPlayerAttachment } from '../player/inventory/player-attachment';
import { on, register, triggerServer } from '@libertymp/rage-rpc';
import { isPlayingAnimation, playAnimation } from '../player/util/player-animation.util';
import { disablePlayerControl, enablePlayerControl } from '../player/util/player-control.util';
import { movementAction } from '../core/disabled-control';

enum FishingState {
  Idle,
  ClosingIn,
  ReelingIn,
}

let fishCatchTimeout = null;
let lastUpdateAt = 0;
let lastGameTick = 0;
let depth = 0;
let distance = 0;
let lineTension = 0;
let reelWindow = 0;
let fishingStat: FishingState | null = null;

const fishes: PedMp[] = [];
let fishingRope: number | null = null;
let fishingFloat: ObjectMp | null = null;
let lastMouseClick = 0;

const MAX_TIME_SCHEDULE = 10_000;
const MIN_TIME_SCHEDULE = 5_000;

// Game constants
const TENSION_RISE_RATE = 0.3; // % per tick when fish is fighting
const TENSION_FALL_RATE = 7.5; // % per tick when at 100% reel
const REEL_DECAY_RATE = 10.0; // % per tick
const REEL_MOUSE_BOOST = 13.5; // % per Space click
const FLOAT_PULL_SPEED = 0.6; // Velocity multiplier when pulling
const TICK_INTERVAL = 50; // ms between ticks
const MOUSE_CLICK_COOLDOWN = 75; // ms between clicks

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

    if (!waterZ) {
      continue;
    }

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
      mp.gui.chat.push('Fish is swimming underwater' + i);
      fishPed.taskWanderInArea(center.x, center.y, waterZ, radius, 0, 0);
    }

    fishes.push(fishPed);
  }
}


function fishingHandler() {
  if (!fishingFloat) return;

  const markerColor = rgbColors.SUN_GLOW_GECKO;
  const { x, y, z } = fishingFloat.position;
  const now = Date.now();

  // Game loop logic (only during ReelingIn phase)
  if (fishingStat === FishingState.ReelingIn && now - lastGameTick >= TICK_INTERVAL) {
    lastGameTick = now;

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

    if (mp.keys.isDown(HexKeyCodes.Space)) {
      if (now - lastMouseClick >= MOUSE_CLICK_COOLDOWN) {
        lastMouseClick = now;

        // Increase reel window
        reelWindow += REEL_MOUSE_BOOST;
        if (reelWindow > 100) {
          lineTension -= TENSION_FALL_RATE;

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
        }
      }
    }
    // If not at 100%, tension rises (fish is fighting)
    lineTension += TENSION_RISE_RATE;
    if (lineTension > 100) lineTension = 100;


    // Check win condition: tension reached 0
    if (lineTension <= 0) {
      mp.gui.chat.push('🎣 Fish caught successfully!');
      stopReelingFishing();
      // TODO: Call server to give reward
      return;
    }

    // Check lose condition: tension maxed out
    if (lineTension >= 100) {
      mp.gui.chat.push('❌ The fish got away... Line broke!');
      stopReelingFishing();
      return;
    }

    // Check if fish is close enough (distance < 2m = caught)
    if (distance < 2.0) {
      mp.gui.chat.push('🎣 Fish reeled in successfully!');
      stopFishing(GameUiKey.FishingMinigame);
      // TODO: Call server to give reward
      return;
    }
  }


  let debug = `${fishingStat === FishingState.Idle ? 'Idle' : fishingStat === FishingState.ClosingIn ? 'ClosingIn' : 'ReelingIn'} \nDistance: ${distance.toFixed(2)}m | Depth: ${depth.toFixed(2)}m \n Tension: ${lineTension.toFixed(2)}% | Reel: ${reelWindow.toFixed(2)}%`;
  debug += `\nreelWindow += ${REEL_DECAY_RATE} per tick`;
  mp.game.graphics.drawText(debug, [0.45, 0.005], {
    font: 4,
    color: [255, 255, 255, 185],
    scale: [0.7, 0.7],
    centre: true,
    outline: true
  });

  // Debug marker
  mp.game.graphics.drawMarker(
    0,
    x, y, z + 1.7,
    0, 0, 0,
    0, 0, 0,
    0.75, 0.75, 0.75,
    markerColor[0], markerColor[1], markerColor[2], 200,
    true, false, 2,
    false, null, null, false
  );

  // Send UI updates
  if (now - lastUpdateAt >= 200) {
    lastUpdateAt = now;

    triggerBrowser(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, {
      lineTension,
      reelWindow,
      distance,
      depth
    });
  }
}


async function startFishing() {
  mp.gui.chat.push('[DEBUG] Starting fishing');

  if (!mp.players.local.isStill())
    return false;

  const waterPos = findWaterInFrontOfPlayer(5.0, -25.0);
  if (!waterPos) {
    return false;
  }

  mp.gui.chat.push('[DEBUG] Water found at ' + JSON.stringify(waterPos));

  mp.players.local.freezePosition(true);
  disablePlayerControl(movementAction);

  mp.gui.chat.push('[DEBUG] Playing casting animation');
  await playAnimation(mp.players.local, 'mini@tennis', 'forehand_ts_md_far', AnimationFlag.UPPER_BODY_ONLY_CONTROLLABLE, 1000);

  while (isPlayingAnimation(mp.players.local, 'mini@tennis', 'forehand_ts_md_far')) {
    mp.gui.chat.push('[DEBUG] Waiting for casting animation to finish');
    await mp.game.waitAsync(50);
  }

  // Play idle fishing animation
  await playAnimation(mp.players.local, 'amb@world_human_stand_fishing@idle_a', 'idle_c', AnimationFlag.STOP_LAST_FRAME | AnimationFlag.NOT_INTERRUPTABLE);

  mp.gui.chat.push('[DEBUG] Spawning fish in area');

  distance = Math.random() * (21.5 - 13) + 13;
  depth = Math.random() * (5 - 1) + 1;

  mp.gui.chat.push('[DEBUG] Creating fishing float object');
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

  await spawnFishInArea(floatPosition, 10.0, 5);

  mp.gui.chat.push('[DEBUG] Waiting for fishing rod attachment');
  const fishingRodObject = getPlayerFishingRodAttachment(mp.players.local);

  while (fishingFloat.handle === 0) {
    await mp.game.waitAsync(50);
  }

  mp.gui.chat.push('[DEBUG] Setting up fishing rope');

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

  fishingStat = FishingState.Idle;

  if (!isGameInterfaceActive(GameUiKey.FishingMinigame))
    showGameInterface(GameUiKey.FishingMinigame);

  mp.events.add('render', fishingHandler);


  function scheduleFishing() {
    const delay = Math.random() * (MAX_TIME_SCHEDULE - MIN_TIME_SCHEDULE) + MIN_TIME_SCHEDULE;
    fishCatchTimeout = setTimeout(() => {
      const chance = Math.random();
      mp.gui.chat.push('[DEBUG] Fish bite chance: ' + chance.toFixed(2));
      if (chance < 0.5 && fishingStat === FishingState.Idle) {
        mp.gui.chat.push('[DEBUG] A fish has bitten the bait!');
        fishingStat = FishingState.ReelingIn;
        const fishClosest = mp.peds.getClosest(fishingFloat.position, 1);
        if (fishClosest.length) {
          fishClosest[0].taskGoStraightToCoord(floatPosition.x, floatPosition.y, floatPosition.z, 3.0, -1, fishingFloat.getHeading(), 1);
          mp.gui.chat.push('[DEBUG] Fish ' + fishClosest[0].handle + ' is approaching the bait');
        }
        lineTension += Math.random() * (30 - 10) + 10;
      }
      scheduleFishing();
    }, delay);
  }

  scheduleFishing();

  mp.gui.chat.push('[DEBUG] Starting fishing game loop');
  return true;
}

function stopReelingFishing() {
  if (fishingStat === FishingState.ReelingIn) {
    fishingStat = FishingState.Idle;
    lineTension = 0;
    reelWindow = 0;
    distance = 0;
    depth = 0;

    if (fishCatchTimeout) {
      clearTimeout(fishCatchTimeout);
      fishCatchTimeout = null;
    }

    if (fishingRope) {
      if (fishingFloat && mp.objects.exists(fishingFloat)) {
        mp.game.rope.detachRopeFromEntity(fishingRope, fishingFloat.handle);
        mp.gui.chat.push('[DEBUG] Detached rope from float');
      }
      mp.game.rope.deleteRope(fishingRope);
      mp.gui.chat.push('[DEBUG] Deleted fishing rope');
      fishingRope = null;
    }

    if (fishingFloat && mp.objects.exists(fishingFloat)) {
      fishingFloat.destroy();
    }

    mp.gui.chat.push('[DEBUG] Fish has stopped reeling in, back to idle');
  }
}
function stopFishing(interfaceKey: GameUiKey) {
  if (interfaceKey !== GameUiKey.FishingMinigame) {
    return;
  }

  mp.gui.chat.push('[DEBUG] Stopping fishing');

  if (fishCatchTimeout) {
    clearTimeout(fishCatchTimeout);
    fishCatchTimeout = null;
  }

  hideGameInterface(GameUiKey.FishingMinigame);

  mp.players.local.clearTasks();
  mp.players.local.freezePosition(false);
  mp.events.remove('render', fishingHandler);

  enablePlayerControl(movementAction);

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
  fishingStat = null;

  triggerServer(ProcedureKey.SERVER_PLAYER_SET_VARIABLE, [PlayerSharedDataType.IsFishing, false]);

  mp.gui.chat.push('[DEBUG] Fishing stopped');
}

register(ProcedureKey.CLIENT_USE_FISHING_ROD, startFishing);
on(ProcedureKey.CLIENT_PLAYER_INTERFACE_CLOSED, stopFishing);
