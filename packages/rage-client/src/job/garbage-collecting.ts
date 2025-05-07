import { off, on, triggerServer } from '@libertymp/rage-rpc';
import { HexKeyCodes, IWorkOptions, JobKey, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { registerKeyBind } from '../core/keybind-manager';
import { isNearTrunk } from '../vehicle/vehicle.util';
import { getDistance } from '../util/vector.util';


const TRASH_PICKUP_RADIUS = 2.0;
const TRASH_LOAD_RADIUS = 2.5;

const TRASH_VEHICLE_MODELS = [
  'trash',
  'trash2'
].map(name => mp.game.joaat(name));

const TRASH_OBJECTS_MODELS = [
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

const closeTrashObjects = new Map<number, BlipMp>();
let markInterval: NodeJS.Timeout | null = null;


const isNotHoldingGarbage = () => {
  return !mp.players.local.getVariable<boolean | undefined>(PlayerSharedDataType.HoldingGarbage);
};

function getClosestTrashObject(x: number, y: number, z: number, radius = TRASH_PICKUP_RADIUS) {
  for (const model of TRASH_OBJECTS_MODELS) {
    const handle = mp.game.object.getClosestObjectOfType(x, y, z, radius, model, false, true, true);
    if (handle !== 0) return { handle, model };
  }
  return undefined;
}

function collectGarbageHandler() {
  if (!mp.players.local.isStill())
    return;

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

function markAllTrashObjectsInRange(x: number, y: number, z: number, radius = TRASH_PICKUP_RADIUS) {
  TRASH_OBJECTS_MODELS.forEach((model) => {
    const trashObjects = mp.game.object.getAllByHash(model);

    if (!trashObjects || trashObjects.length === 0)
      return;

    trashObjects.forEach((t) => {
      if (getDistance(mp.players.local.position, t) < radius) {
        const objectHandle = mp.game.object.getClosestObjectOfType(x, y, z, radius, model, false, true, true);
        if (objectHandle !== 0 && !closeTrashObjects.has(t.x)) {
          const blip = mp.blips.new(318, t, {
            color: 12,
            shortRange: true,
            dimension: mp.players.local.dimension
          });

          closeTrashObjects.set(t.x, blip);
        }
      }
    });
  });
}

function markGarbageDeliveryPointHandler(position: Vector3) {
  const deliveryCheckpoint = mp.checkpoints.new(47, new mp.Vector3(position.x, position.y, position.z - 1.25), 3, {
    dimension: mp.players.local.dimension,
    color: [255, 185, 40, 200],
    visible: true
  });

  mp.game.ui.setNewWaypoint(position.x, position.y);

  const playerEnterGarbageDeliveryPoint = async (checkpoint: CheckpointMp) => {
    if (checkpoint.id === deliveryCheckpoint.id) {
      if (!mp.players.local.vehicle)
        return;

      while (!mp.players.local.vehicle.isStopped()) {
        await mp.game.waitAsync(50);
      }

      if (deliveryCheckpoint && mp.checkpoints.exists(deliveryCheckpoint))
        deliveryCheckpoint.destroy();

      mp.events.remove('playerEnterCheckpoint', playerEnterGarbageDeliveryPoint);
    }
  };

  mp.events.add('playerEnterCheckpoint', playerEnterGarbageDeliveryPoint);
}

function handleIsWorkingGarbageDataHandler(player: PlayerMp, value: IWorkOptions, oldValue: IWorkOptions | undefined) {
  if (player.type != RageEnums.EntityType.PLAYER)
    return;

  if (player.handle != mp.players.local.handle)
    return;

  if ((value && value.jobKey != JobKey.Sanitation) || (oldValue && oldValue.jobKey != JobKey.Sanitation))
    return;

  if (value) {
    markInterval = setInterval(() => {
      markAllTrashObjectsInRange(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 150);
    }, 1000);

    on(ProcedureKey.CLIENT_CREATE_CHECKPOINT, markGarbageDeliveryPointHandler);
  } else {
    if (markInterval) {
      clearInterval(markInterval);
      markInterval = null;
    }

    closeTrashObjects.forEach((blip) => {
      if (blip && mp.blips.exists(blip)) {
        blip.destroy();
      }
    });

    off(ProcedureKey.CLIENT_CREATE_CHECKPOINT, markGarbageDeliveryPointHandler);

    closeTrashObjects.clear();
  }
}

registerKeyBind(HexKeyCodes.Y, true, collectGarbageHandler, 0, [isNotHoldingGarbage]);
mp.events.addDataHandler(PlayerSharedDataType.HoldingGarbage, holdingGarbageDataHandler);
mp.events.addDataHandler(PlayerSharedDataType.Work, handleIsWorkingGarbageDataHandler);
