// List of banned materials that we should not detect
// (for example if you want to void pools)
// https://wiki.rage.mp/wiki/Raycast_Materials
import { callBrowser, hideGameInterface, showGameInterface } from '../core/browser';
import { AnimationFlag, GameUiKey, PlayerAttachmentTypeEnum, ProcedureKey } from '@revolt-rp/common';
import { hasPlayerAttachment } from '../player/inventory/player-attachment';
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

const isHoldingFishingRod = (player: PlayerMp) => {
  return hasPlayerAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01);
};

async function startFishing() {
  if (inMinigame) {
    return;
  }

  const waterPos = findWaterInFrontOfPlayer(5.0, -25.0);
  if (!waterPos) {
    return;
  }

  mp.players.local.freezePosition(true);
  showGameInterface(GameUiKey.FishingMinigame);

  // TaskPlayAnim(cache.ped, 'mini@tennis', 'forehand_ts_md_far', 3.0, 3.0, 1.0, 16, 0, false, false, false)
  //
  // if not wait(1500) then return end
  //
  // TaskPlayAnim(cache.ped, 'amb@world_human_stand_fishing@idle_a', 'idle_c', 3.0, 3.0, -1, 11, 0, false, false, false)

  await playAnimation(mp.players.local, 'amb@world_human_stand_fishing@idle_a', 'idle_c', AnimationFlag.UPPER_BODY_ONLY, -1);

  await mp.game.waitAsync(1500);

  await playAnimation(mp.players.local, 'amb@world_human_stand_fishing@idle_a', 'idle_c', AnimationFlag.STOP_LAST_FRAME | AnimationFlag.NOT_INTERRUPTABLE, -1);

  scheduleNextFishing();
}

function stopFishing() {
  if (fishingTimer) {
    clearTimeout(fishingTimer);
    fishingTimer = null;
  }

  hideGameInterface(GameUiKey.FishingMinigame)
  inMinigame = false;
}

function startFishingMinigame() {
  if (!isHoldingFishingRod(mp.players.local)) {
    return;
  }

  inMinigame = true;

  const diifficulty = Math.random(); // TODO: Determine difficulty based on conditions
  setTimeout(async () => {
    const success = await callBrowser<boolean>(ProcedureKey.BROWSER_FISHING_MINIGAME_START, null, { timeout: MINIGAME_TIMEOUT_MS });
    if (success) {
      mp.events.call('fishing:minigame:success');
    } else {
      mp.events.call('fishing:minigame:failure');
    }
  }, 500);
}

function updateUi() {

  // mp.game.water.getWaterHeight(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
  }

  function scheduleNextFishing() {
    const delay = Math.random() * (MAX_TIME_SCHEDULE - MIN_TIME_SCHEDULE) + MIN_TIME_SCHEDULE;
    fishingTimer = setTimeout(() => {
      if (!inMinigame) {
        // 50% chance to start fishing minigame
        const chance = Math.random();
        if (chance < 0.5)
          startFishingMinigame();
      }
      scheduleNextFishing();
    }, delay);
  }

  on(ProcedureKey.CLIENT_USE_FISHING_ROD, startFishing);
