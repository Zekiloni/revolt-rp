import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import {
  AnimationFlag,
  GameUiKey, IVehicleSellOffer,
  IVehicleUpdateData,
  PlayerSharedDataType,
  ProcedureKey,
  VehicleIndicator,
  VehicleSharedDataType
} from '@revolt-rp/common';
import {
  createVehicleSellOffer, findVehicle,
  getAllVehicles, getSpawnedVehicleById,
  getVehicleById,
  getVehiclesByOwner,
  hasPlayerVehicleKeys,
  loadVehicle,
  lockVehicle,
  parkVehicle,
  saveVehicle,
  toggleVehicleEngine,
  toggleVehicleHood,
  toggleVehicleIndicator,
  toggleVehicleTrunk
} from './vehicle.service';
import { playAnimation } from '../player/util/player-animation.util';
import { isVehicleTrunkOpen } from './vehicle-inventory.service';
import { hidePlayerGameInterface } from '../player/util/player.util';
import { notifyPlayer } from '../player/util/player-notify.util';
import { t } from 'i18next';
import { FilterQuery } from 'mongoose';
import { Vehicle } from './vehicle.model';


async function playerEnterVehicleHandler(player: PlayerMp, vehicle: VehicleMp, seat: RageEnums.VehicleSeat) {
  if (seat == RageEnums.VehicleSeat.DRIVER) {
    // TODO: do something
  }
}

function playerExitVehicleHandler(player: PlayerMp, vehicle: VehicleMp, seat: number) {
  player.lastVehicle = vehicle;
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
  hidePlayerGameInterface(player, GameUiKey.VehicleMenu);
}

async function loadVehicleHandler(vehicleId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  getVehicleById(vehicleId)
    .then(vehicle => loadVehicle(vehicle));
}


function createVehicleSellOfferHandler(offer: IVehicleSellOffer, { player }: ProcedureListenerInfo<PlayerMp>) {
  const target = mp.players.at(offer.targetId);

  if (!target || !target.character)
    return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

  if (player.dist(target.position) > 10)
    return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('target_not_close') });

  getSpawnedVehicleById(offer.vehicleId)
    .then(vehicle => createVehicleSellOffer(player, vehicle, offer.price, target));
}

function findVehicleHandler(query: FilterQuery<Vehicle>) {
  return findVehicle(query);
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
on(ProcedureKey.SERVER_VEHICLE_SELL_OFFER, createVehicleSellOfferHandler);
register(ProcedureKey.SERVER_GET_PLAYER_VEHICLES, getPlayerVehiclesHandler);
register(ProcedureKey.SERVER_FIND_VEHICLE, findVehicleHandler);

(async () => {
  getAllVehicles({ isSpawned: true })
    .then(vehicles => vehicles.forEach(loadVehicle));
})();
