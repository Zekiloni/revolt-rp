import { GameUiKey, VehicleSharedDataType } from '@revolt-rp/common';
import { hideGameInterface, showGameInterface } from '../../../core/browser';
import { KMH_FRACTION } from '../../vehicle-core';
import { getVehicleDisplayName } from '../../vehicle.util';


let lastUpdateAt = 0;

function getForwardHitVehicle() {
  if (!mp.players.local.vehicle) return null;


  const start = mp.players.local.vehicle.getCoords(false);
  const heading = mp.players.local.vehicle.getHeading();

  const distance = 25;

  const forward = new mp.Vector3(
    start.x + Math.cos(((heading + 90) * Math.PI) / 180) * distance,
    start.y + Math.sin(((heading + 90) * Math.PI) / 180) * distance,
    start.z
  );

  const raycast = mp.raycasting.testPointToPoint(
    start,
    forward,
    mp.players.local.vehicle.handle,
    2
  );

  if (raycast && typeof raycast.entity === 'object') {
    if (raycast.entity.type === RageEnums.EntityType.VEHICLE) {
      return raycast.entity as VehicleMp;
    }
  }

  return null;
}

function plateRecognitionHandler(): void {
  if (!mp.players.local.vehicle) return;

  const vehicle = getForwardHitVehicle();
  if (!vehicle) return;

  if (!mp.players.local.hasClearLosTo(vehicle.handle, 17)) return;

  const plateText = mp.game.vehicle.getNumberPlateText(vehicle.handle);
  const speed = vehicle.getSpeed() * KMH_FRACTION;
  const displayName = getVehicleDisplayName(vehicle.model);

  if (Date.now() - lastUpdateAt > 500) {
    // todo call browser
    lastUpdateAt = Date.now();
  }

}

function togglePlateRecognition(toggle: boolean) {
  if (toggle) {
    showGameInterface(GameUiKey.PlateRecognition);
    mp.events.add('render', plateRecognitionHandler);
  } else {
    hideGameInterface(GameUiKey.PlateRecognition);
    mp.events.remove('render', plateRecognitionHandler);
  }
}

function plateRecognitionDataHandler(vehicle: VehicleMp, value: boolean, oldValue?: boolean): void {
  if (value === oldValue || value === undefined) return;

  const isVehicleTypeValid = vehicle.type === RageEnums.EntityType.VEHICLE;
  const isPlayerInVehicle = mp.players.local.vehicle === vehicle;

  if (!isVehicleTypeValid || !isPlayerInVehicle) return;

  togglePlateRecognition(value);
}

function playerEnterVehicleHandler(vehicle: VehicleMp, seat: number) {
  const isRecognitionEnabled = vehicle.getVariable<boolean | undefined>(VehicleSharedDataType.PlateRecognition);
  const isDriverOrPassenger = seat === RageEnums.VehicleSeat.DRIVER || seat === RageEnums.VehicleSeat.PASSENGER;

  if (!isDriverOrPassenger || !isRecognitionEnabled) return;

  togglePlateRecognition(true);
}

function playerLeaveVehicleHandler(vehicle: VehicleMp) {
  if (!vehicle) return;

  const isRecognitionEnabled = vehicle.getVariable<boolean | undefined>(VehicleSharedDataType.PlateRecognition);

  if (!isRecognitionEnabled) return;
  togglePlateRecognition(false);
}

mp.events.addDataHandler(VehicleSharedDataType.PlateRecognition, plateRecognitionDataHandler);
mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler,
  playerLeaveVehicle: playerLeaveVehicleHandler
});
