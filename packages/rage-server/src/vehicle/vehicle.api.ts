import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import {
  AnimationFlag,
  IVehicleUpdateData, PlayerSharedDataType,
  ProcedureKey,
  VehicleIndicator,
  VehicleSharedDataType
} from '@revolt-rp/common';
import {
  getAllVehicles,
  hasPlayerVehicleKeys,
  lockVehicle, saveVehicle, loadVehicle,
  toggleVehicleEngine, toggleVehicleHood,
  toggleVehicleIndicator, toggleVehicleTrunk, getVehiclesByOwner, parkVehicle, getVehicleById
} from './vehicle.service';
import { playAnimation } from '../player/util/player-animation.util';
import { isVehicleTrunkOpen } from './vehicle-inventory.service';


async function playerEnterVehicleHandler(player: PlayerMp, vehicle: VehicleMp, seat: RageEnums.VehicleSeat) {
  if (seat == RageEnums.VehicleSeat.DRIVER) {
    // TODO: do something
  }
}

function playerExitVehicleHandler(player: PlayerMp, vehicle: VehicleMp, seat: number) {
  // TODO: do something
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

  console.log('has keys', hasPlayerVehicleKeys(player, vehicle));
  if (!hasPlayerVehicleKeys(player, vehicle))
    return;

  playAnimation(player, 'anim@mp_player_intmenu@key_fob@', 'fob_click_fp', AnimationFlag.UPPER_BODY_ONLY);
  lockVehicle(vehicle);
}

async function playerUpdateVehicleDataHandler(data: IVehicleUpdateData, { player }: ProcedureListenerInfo<PlayerMp>) {
  const vehicle = mp.vehicles.at(data.vehicleId);

  if (vehicle) {
    vehicle.setVariable(VehicleSharedDataType.Mileage, parseFloat(data.mileage.toFixed(2)));
    vehicle.setVariable(VehicleSharedDataType.Fuel, data.fuel);

    await saveVehicle(vehicle);
  }
}

function playerToggleVehicleIndicatorHandler(index: VehicleIndicator, { player }: ProcedureListenerInfo<PlayerMp>) {
  const vehicle = player.vehicle;

  if (!vehicle || player.seat !== RageEnums.VehicleSeat.DRIVER)
    return;

  toggleVehicleIndicator(vehicle, index);
}

function playerToggleSeatbeltHandler(_args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  const vehicle = player.vehicle;

  if (!vehicle)
    return;

  const seatbelt = !player.getVariable(PlayerSharedDataType.Seatbelt);
  player.setVariable(PlayerSharedDataType.Seatbelt, seatbelt);
}


function toggleVehicleTrunkHandler(vehicle: VehicleMp, { player }: ProcedureListenerInfo<PlayerMp>) {
  if (!isVehicleTrunkOpen(vehicle) && vehicle.locked)
    return;

  toggleVehicleTrunk(vehicle);
}

function toggleVehicleHoodHandler(vehicle: VehicleMp, { player }: ProcedureListenerInfo<PlayerMp>) {
  if (!isVehicleTrunkOpen(vehicle) && vehicle.locked)
    return;

  toggleVehicleHood(vehicle);
}

function getPlayerVehiclesHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  return getVehiclesByOwner(player.character.id);
}

async function parkVehicleHandler(vehicle: VehicleMp | undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  if (!vehicle)
    vehicle = player.vehicle;

  if (!vehicle)
    return;

  await parkVehicle(vehicle);
}

async function loadVehicleHandler(vehicleId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  getVehicleById(vehicleId)
    .then(vehicle => loadVehicle(vehicle));
}

mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler,
  playerExitVehicle: playerExitVehicleHandler
});

on(ProcedureKey.SERVER_PLAYER_UPDATE_VEHICLE_DATA, playerUpdateVehicleDataHandler);
on(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_ENGINE, playerToggleVehicleEngineHandler);
on(ProcedureKey.SERVER_PLAYER_TOGGLE_SEATBELT, playerToggleSeatbeltHandler);
on(ProcedureKey.SERVER_PLAYER_LOCK_VEHICLE, playerLockVehicleHandler);
on(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_INDICATOR, playerToggleVehicleIndicatorHandler);
on(ProcedureKey.SERVER_VEHICLE_TOGGLE_TRUNK, toggleVehicleTrunkHandler);
on(ProcedureKey.SERVER_VEHICLE_TOGGLE_HOOD, toggleVehicleHoodHandler);
on(ProcedureKey.SERVER_PARK_VEHICLE, parkVehicleHandler);
on(ProcedureKey.SERVER_VEHICLE_LOAD, loadVehicleHandler);
register(ProcedureKey.SERVER_GET_PLAYER_VEHICLES, getPlayerVehiclesHandler);

(async () => {
  getAllVehicles({ isSpawned: true })
    .then(vehicles => vehicles.forEach(loadVehicle));
})();
