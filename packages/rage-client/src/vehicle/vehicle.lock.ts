import { triggerServer } from '@libertymp/rage-rpc';
import { HexKeyCodes, ProcedureKey, VehicleSharedDataType } from '@revolt-rp/common';
import { getIsAlive, getIsNotCuffed, getIsSpawned } from '../player/util/player-data.util';
import { registerKeyBind } from '../core/keybind-manager';


const VEHICLE_LOCK_DISTANCE = 10;

function toggleVehicleLock() {
  if (!mp.vehicles.length)
    return;

  const [closestVehicle] = mp.vehicles.getClosest(mp.players.local.position, VEHICLE_LOCK_DISTANCE);

  if (!closestVehicle)
    return;

  triggerServer(ProcedureKey.SERVER_PLAYER_LOCK_VEHICLE, closestVehicle.remoteId);
}

function vehicleLockedDataHandler(vehicle: VehicleMp, value: boolean, oldValue?: boolean) {
  if (vehicle.type != RageEnums.EntityType.VEHICLE)
    return;

  if (value != oldValue) {
    const soundId = mp.game.audio.getSoundId();

    mp.game.audio.playSoundFromEntity(
      soundId,
      value ? 'Remote_Control_Close' : 'Remote_Control_Open',
      vehicle.handle,
      'PI_Menu_Sounds',
      true,
      0
    );
  }
}

registerKeyBind(HexKeyCodes.L, false, toggleVehicleLock, 0, [getIsSpawned, getIsNotCuffed, getIsAlive]);
mp.events.addDataHandler(VehicleSharedDataType.Locked, vehicleLockedDataHandler);
