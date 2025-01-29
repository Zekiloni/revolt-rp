import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import {
  AnimationFlag,
  IVehicleUpdateData,
  ProcedureKey,
  VehicleIndicator,
  VehicleSharedDataType
} from '@revolt-rp/common';
import {
  hasPlayerVehicleKeys,
  lockVehicle,
  saveVehicle,
  toggleVehicleEngine,
  toggleVehicleIndicator
} from './vehicle.service';
import { playAnimation } from '../player/util/player-animation.util';

function playerEnterVehicleHandler(player: PlayerMp, vehicle: VehicleMp, seat: RageEnums.VehicleSeat) {
  if (seat == RageEnums.VehicleSeat.DRIVER) {


    saveVehicle(vehicle);
  }
}

function playerExitVehicleHandler(player: PlayerMp, vehicle: VehicleMp, seat: number) {

}

function playerToggleVehicleEngineHandler(params: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  const vehicle = player.vehicle;

  // TODO: Check has keys

  if (vehicle && player.seat === RageEnums.VehicleSeat.DRIVER) {
    toggleVehicleEngine(vehicle);
  }
}

function playerLockVehicleHandler(vehicleId: number, { player }: ProcedureListenerInfo<PlayerMp>) {
  // TODO: check has player keys

  const vehicle = mp.vehicles.at(vehicleId);

  if (!vehicle)
    return;

  if (player.dist(vehicle.position) > 10)
    return;

  if (!hasPlayerVehicleKeys(player, vehicle))
    return;

  playAnimation(player, 'anim@mp_player_intmenu@key_fob@', 'fob_click_fp', AnimationFlag.UPPER_BODY_ONLY);
  lockVehicle(vehicle);
}

function playerUpdateVehicleDataHandler(data: IVehicleUpdateData, { player }: ProcedureListenerInfo<PlayerMp>) {
  const vehicle = mp.vehicles.at(data.vehicleId);

  if (vehicle) {
    vehicle.setVariable(VehicleSharedDataType.Mileage, parseFloat(data.mileage.toFixed(2)));
    vehicle.setVariable(VehicleSharedDataType.Fuel, data.fuel);
  }
}

function playerToggleVehicleIndicatorHandler(index: VehicleIndicator, { player }: ProcedureListenerInfo<PlayerMp>) {
  const vehicle = player.vehicle;

  if (!vehicle || player.seat !== RageEnums.VehicleSeat.DRIVER)
    return;

  toggleVehicleIndicator(vehicle, index);
}


mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler,
  playerExitVehicle: playerExitVehicleHandler
});

on(ProcedureKey.SERVER_PLAYER_UPDATE_VEHICLE_DATA, playerUpdateVehicleDataHandler);
on(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_ENGINE, playerToggleVehicleEngineHandler);
on(ProcedureKey.SERVER_PLAYER_LOCK_VEHICLE, playerLockVehicleHandler);
on(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_INDICATOR, playerToggleVehicleIndicatorHandler);
