import { triggerServer } from '@libertymp/rage-rpc';
import { HexKeyCodes, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { registerKeyBind } from '../core/keybind-manager';
import { isNearTrunk } from '../vehicle/vehicle.util';


const CONTAINER_USE_RADIUS = 2.0;
const TRASH_LOAD_RADIUS = 3.5;

const TRASH_VEHICLE_MODELS = [
  'trash',
  'trash2'
].map(name => mp.game.joaat(name));

const TRASH_OBJECTS = [
  'prop_bin_01a',
  'prop_bin_02a',
  'prop_bin_03a',
  'prop_bin_04a',
  'prop_bin_05a',
  'prop_bin_06a',
  'prop_bin_07a',
  'prop_bin_08a',
  'prop_bin_09a',
  'prop_bin_10a',
  'prop_bin_11a',
  'prop_bin_12a',
  'prop_bin_13a',
  'prop_dumpster_01a',
  'prop_dumpster_02a',
  'prop_dumpster_02b',
  'prop_dumpster_3a',
  'prop_dumpster_4a',
  'prop_dumpster_4b'
].map(name => mp.game.joaat(name));

const isNotHoldingGarbage = () => {
  return !mp.players.local.getVariable<boolean | undefined>(PlayerSharedDataType.HoldingGarbage);
};

function getClosestTrashObject(x: number, y: number, z: number) {
  for (const model of TRASH_OBJECTS) {
    const handle = mp.game.object.getClosestObjectOfType(x, y, z, CONTAINER_USE_RADIUS, model, false, true, true);
    if (handle !== 0) return { handle, model };
  }
  return undefined;
}

function collectGarbageHandler() {
  const { x, y, z } = mp.players.local.position;
  const closestTrashObject = getClosestTrashObject(x, y, z);

  if (closestTrashObject) {
    const { handle } = closestTrashObject;
    triggerServer(ProcedureKey.SERVER_PLAYER_COLLECT_GARBAGE, handle);
  }
}


function handleLoadGarbage() {
  if (!mp.vehicles.length)
    return;

  const [closestVehicle] = mp.vehicles.getClosest(mp.players.local.position, TRASH_LOAD_RADIUS);

  if (closestVehicle && TRASH_VEHICLE_MODELS.includes(closestVehicle.model)) {
    if (isNearTrunk(closestVehicle, TRASH_LOAD_RADIUS)) {
      triggerServer(ProcedureKey.SERVER_PLAYER_LOAD_GARBAGE, closestVehicle);
    }
  }
}

function holdingGarbageDataHandler(player: PlayerMp, value: boolean, oldValue: boolean | undefined) {
  if (player.type != RageEnums.EntityType.PLAYER)
    return;

  if (player.handle != mp.players.local.handle)
    return;

  if (value) {
    mp.events.add('click', handleLoadGarbage);
  } else {
    mp.events.remove('click', handleLoadGarbage);
  }
}

registerKeyBind(HexKeyCodes.Y, true, collectGarbageHandler, 0, [isNotHoldingGarbage]);
mp.events.addDataHandler(PlayerSharedDataType.HoldingGarbage, holdingGarbageDataHandler);
