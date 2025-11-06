// List of banned materials that we should not detect
// (for example if you want to void pools)
// https://wiki.rage.mp/wiki/Raycast_Materials
import { callBrowser, showGameInterface } from '../core/browser';
import { GameUiKey, ProcedureKey } from '@revolt-rp/common';

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
const MIN_TIME_SCHEDULE = 30000;
const MAX_TIME_SCHEDULE = 90000;
const MINIGAME_TIMEOUT_MS = 10000;

function startFishing() {
  if (inMinigame) return;
  const waterPos = findWaterInFrontOfPlayer(5.0, -25.0);
  if (!waterPos) {
    mp.events.call('notification:show', 'No water detected in front of you.', 3000, 'error');
    return;
  }

  inMinigame = true;
  mp.events.call('fishing:minigame:start', waterPos);

}

function startFishingMinigame() {
  inMinigame = true;

  if (fishingTimer) {
    clearTimeout(fishingTimer);
    fishingTimer = null;
  }

  const diifficulty = Math.random(); // TODO: Determine difficulty based on conditions
  // TODO: Show fishing minigame UI
  // Wait for player to finish minigame
  showGameInterface(GameUiKey.FishingMinigame);
  setTimeout(async () => {
    const success = await callBrowser<boolean>(ProcedureKey.BROWSER_FISHING_MINIGAME_START, null, { timeout: MINIGAME_TIMEOUT_MS });
    if (success) {
      mp.events.call('fishing:minigame:success');
    } else {
      mp.events.call('fishing:minigame:failure');
    }
  }, 500);
}


function scheduleNextFishing() {
  const delay = Math.random() * (MAX_TIME_SCHEDULE - MIN_TIME_SCHEDULE) + MIN_TIME_SCHEDULE; // 30s–90s
  fishingTimer = setTimeout(() => {
    if (!inMinigame) {
      startFishingMinigame();
    }
    scheduleNextFishing();
  }, delay);
}
