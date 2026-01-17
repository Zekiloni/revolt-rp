import { FilterQuery, Types } from 'mongoose';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import {
  EntitySharedDataType,
  formatCurrency,
  GameUiKey, IAudio3D,
  IVehicle, IVehicleXmrState,
  ProcedureKey, vehicleColors,
  VehicleIndicator,
  VehicleSharedDataType
} from '@revolt-rp/common';
import { createDefaultVehicleInfo } from './vehicle.util';
import { showPlayerGameInterface } from '../player/util/player.util';
import { createPlayerOffer } from '../player/offer/player-offer.service';
import { t } from 'i18next';
import { notifyPlayer } from '../player/util/player-notify.util';
import { giveMoney } from '../player/character/character.service';
import { Character, Vehicle, vehicleConfig, VehicleModel } from '@revolt-rp/core';
import { destroyItemById } from '../item/item.service';


export const getAllVehicles = async (filterQuery?: FilterQuery<Vehicle>) => {
  return VehicleModel.find(filterQuery).exec();
};

export const createTemporaryVehicle = (model: string, position: Vector3, primaryColor: number, secondaryColor: number, options?: Partial<IVehicle>) => {
  const vehicle = mp.vehicles.new(mp.joaat(model), position, {
    heading: options?.rotation?.z ?? 0,
    engine: options?.engine ?? false,
    locked: options?.locked ?? false
  });

  if (options && options.rotation)
    vehicle.rotation = new mp.Vector3(options.rotation.x, options.rotation.y, options.rotation.z);

  vehicle.setColor(primaryColor, secondaryColor);

  vehicle.info = new VehicleModel(createDefaultVehicleInfo(options, model, position, vehicle, true));

  vehicle.info.locked = vehicle.locked;
  vehicle.info.color = [vehicleColors[primaryColor].rgbColor, vehicleColors[secondaryColor].rgbColor];
  vehicle.info.position = position;

  loadVehicleVariables(vehicle, vehicle.info);

  return vehicle;
};


export const createVehicle = async (model: string, position: Vector3, primaryColor: number, secondaryColor: number, options?: Partial<IVehicle>) => {
  const vehicle = mp.vehicles.new(mp.joaat(model), position, {
    heading: options?.rotation?.z ?? 0,
    engine: options?.engine ?? false,
    locked: options?.locked ?? false
  });

  if (options && options.rotation)
    vehicle.rotation = new mp.Vector3(options.rotation.x, options.rotation.y, options.rotation.z);

  vehicle.setColor(primaryColor, secondaryColor);

  const defaultVehicleInfo = {
    ...createDefaultVehicleInfo(options, model, position, vehicle, false),
    locked: vehicle.locked,
    position: vehicle.position,
    color: [vehicleColors[primaryColor].rgbColor, vehicleColors[secondaryColor].rgbColor]
  };


  vehicle.info = new VehicleModel(defaultVehicleInfo);
  await vehicle.info.save();

  if (options && options.numberplate) {
    vehicle.numberPlate = options.numberplate.content ?? '';
    vehicle.numberPlateType = options.numberplate.modelType ?? vehicleConfig.defaultNumberPlateType;
  }

  loadVehicleVariables(vehicle, vehicle.info);

  return vehicle;
};

export const loadVehicle = async (vehicle: Vehicle) => {
  if (!vehicle)
    return;

  const position = new mp.Vector3(vehicle.position.x, vehicle.position.y, vehicle.position.z);
  const rotation = new mp.Vector3(vehicle.rotation.x, vehicle.rotation.y, vehicle.rotation.z);

  const vehicleMp = mp.vehicles.new(mp.joaat(vehicle.model), position, {
    heading: vehicle.rotation.z,
    engine: false,
    color: vehicle.color,
    locked: vehicle.locked
  });

  vehicle.isSpawned = true;
  vehicle.rotation = rotation;
  vehicle.color = [vehicleMp.getColorRGB(0), vehicleMp.getColorRGB(1)];
  vehicleMp.info = vehicle;

  if (vehicle.numberplate) {
    vehicleMp.numberPlate = vehicle.numberplate.content ?? '';
    vehicleMp.numberPlateType = vehicle.numberplate.modelType ?? vehicleConfig.defaultNumberPlateType;
  }

  loadVehicleVariables(vehicleMp, vehicle);
};

export const parkVehicle = async (vehicle: VehicleMp) => {
  vehicle.info.position = vehicle.position;
  vehicle.info.rotation = vehicle.rotation;

  vehicle.info.engineHealth = vehicle.engineHealth;
  vehicle.info.bodyHealth = vehicle.bodyHealth;

  vehicle.info.isSpawned = false;

  await vehicle.info.save();

  if (vehicle && mp.vehicles.exists(vehicle)) {
    vehicle.destroy();
  }
};

export const setVehicleOwner = (vehicle: VehicleMp, character: Character) => {
  vehicle.info.owner = character;
};

export const deleteVehicle = async (vehicle: VehicleMp) => {
  if (vehicle && mp.vehicles.exists(vehicle)) {
    vehicle.destroy();
  }

  vehicle.info.trunk.forEach((item) => destroyItemById((<Types.ObjectId>item).toString()))

  await VehicleModel.findByIdAndDelete(vehicle.info.id).exec();
}

function loadVehicleVariables(vehicle: VehicleMp, info: Vehicle) {
  vehicle.setVariables({
    [VehicleSharedDataType.Engine]: info.engine,
    [VehicleSharedDataType.Locked]: info.locked,
    [VehicleSharedDataType.IsTemporary]: info.isTemporary,
    [VehicleSharedDataType.VehicleId]: info.id || undefined,
    [VehicleSharedDataType.Windows]: [false, false, false, false],
    [VehicleSharedDataType.Indicators]: [false, false],
    [VehicleSharedDataType.Trunk]: false,
    [VehicleSharedDataType.Hood]: false
  });
}

export const teleportVehicle = (vehicle: VehicleMp, position: Vector3, dimension: number) => {
  vehicle.dimension = dimension;
  vehicle.position = position;
  vehicle.info.position = position;
  vehicle.info.dimension = dimension;
}

export const teleportPlayerToVehicle = (player: PlayerMp, vehicle: VehicleMp) => {
  player.dimension = vehicle.dimension;
  player.position = vehicle.position;
}

export const isTemporaryVehicle = (vehicle: VehicleMp) => {
  return vehicle.getVariable<boolean>(VehicleSharedDataType.IsTemporary);
};

export const isRentVehicle = (vehicle: VehicleMp) => {
  return vehicle.info.rented;
};

export const isPrivateVehicle = (vehicle: VehicleMp) => {
  return vehicle.info.owner && !vehicle.info.organization && !vehicle.info.rented && vehicle.info.jobKey === undefined;
};

export const getVehicleId = (vehicle: VehicleMp) => {
  return vehicle.getVariable<string | undefined>(VehicleSharedDataType.VehicleId);
};

export const getRentedVehicle = async () => {
  return VehicleModel.find({ rented: true });
};

export const saveVehicle = async (vehicle: VehicleMp) => {
  vehicle.info.position = vehicle.position;
  vehicle.info.rotation = vehicle.rotation;

  vehicle.info.mileage = vehicle.getVariable<number>(VehicleSharedDataType.Mileage);
  vehicle.info.fuel = vehicle.getVariable<number>(VehicleSharedDataType.Fuel);
  vehicle.info.bodyHealth = vehicle.bodyHealth;
  vehicle.info.engineHealth = vehicle.engineHealth;

  if (!vehicle.info.isTemporary)
    await vehicle.info.save();
};


export const hasPlayerVehicleKeys = (player: PlayerMp, vehicle: VehicleMp) => {
  return vehicle.info.owner._id.equals(player.character.id);
};

export function toggleVehicleEngine(vehicle: VehicleMp) {
  // TODO: modify this later
  if (vehicle.engineHealth < 300)
    return;

  vehicle.engine = !vehicle.engine;
  vehicle.setVariable(VehicleSharedDataType.Engine, vehicle.engine);
}

export function lockVehicle(vehicle: VehicleMp) {
  vehicle.locked = !vehicle.locked;
  vehicle.setVariable(VehicleSharedDataType.Locked, vehicle.locked);

  if (!isTemporaryVehicle(vehicle)) {
    //
  }
}


export function toggleVehicleIndicator(vehicle: VehicleMp, index: VehicleIndicator) {
  const indicators = vehicle.getVariable<[boolean, boolean]>(VehicleSharedDataType.Indicators) ?? [false, false];
  indicators[index] = !indicators[index];
  vehicle.setVariable(VehicleSharedDataType.Indicators, indicators);
}


export function toggleVehicleWindow(vehicle: VehicleMp, seat: RageEnums.VehicleSeat) {
  const windows = vehicle.getVariable<boolean[]>(VehicleSharedDataType.Windows);
  windows[seat] = !windows[seat] ?? true;
  vehicle.setVariable(VehicleSharedDataType.Windows, windows);
}


export function toggleVehicleTrunk(vehicle: VehicleMp) {
  const trunk = vehicle.getVariable<boolean>(VehicleSharedDataType.Trunk);
  vehicle.setVariable(VehicleSharedDataType.Trunk, !trunk);
}

export function toggleVehicleHood(vehicle: VehicleMp) {
  const hood = vehicle.getVariable<boolean>(VehicleSharedDataType.Hood);
  vehicle.setVariable(VehicleSharedDataType.Hood, !hood);
}

export const toggleVehicleEditMenu = (player: PlayerMp, vehicle: VehicleMp) => {
  showPlayerGameInterface(player, GameUiKey.ManageVehicle,
    () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_VEHICLE, vehicle.info));
};

export const acceptVehicleSellOffer = async (player: PlayerMp, offerer: PlayerMp, vehicle: VehicleMp, price: number) => {
  if (!offerer || !mp.players.exists(offerer.id)) {
    return notifyPlayer(player, { severity: 'error', detail: t('vehicle_sell_offer_expired') });
  }

  setVehicleOwner(vehicle, player.character);

  await giveMoney(player, -price);
  await giveMoney(offerer, price);

  await vehicle.info.save();
};

export const declineVehicleSellOffer = async (player: PlayerMp, offerer: PlayerMp) => {
  notifyPlayer(player, { severity: 'info', detail: t('you_declined_vehicle_buy', { player: offerer.name }) });

  if (offerer && mp.players.at(offerer.id))
    notifyPlayer(offerer, { severity: 'info', detail: t('vehicle_sell_offer_declined', { player: player.name }) });
};

export const createVehicleSellOffer = async (player: PlayerMp, vehicle: VehicleMp, price: number, target: PlayerMp) => {
  const acceptOffer = async (_target: PlayerMp) => acceptVehicleSellOffer(_target, player, vehicle, price),
    declineOffer = async (_target: PlayerMp) => declineVehicleSellOffer(_target, player);

  createPlayerOffer(
    target,
    t('vehicle_sell_offer_info', { model: vehicle.info.model, offerer: player.name, price: formatCurrency(price) }),
    acceptOffer,
    declineOffer,
    player
  );
};


export const getVehiclesByOwner = async (ownerId: string) => {
  return VehicleModel.find({ owner: ownerId }).exec();
};

export const getVehicleById = (vehicleId: string) => {
  return VehicleModel.findById(vehicleId);
};


export const getSpawnedVehicleById = async (vehicleId: string) => {
  const vehicle = mp.vehicles.toArray().find(v => {
    console.log('find', v.info?.id, vehicleId);
    return v.info?.id === vehicleId;
  });
  if (!vehicle) throw new Error('Vehicle not found');
  return vehicle; // This auto-resolves the promise
};


export const findVehicle = async (query: FilterQuery<Vehicle>) => {
  return VehicleModel.findOne(query)
    .populate('owner')
    .exec();
};


export const updateVehicleXmr = (vehicle: VehicleMp, xmrState: IVehicleXmrState) => {
  let sound : IAudio3D | null
  if (xmrState.toggle) {
    sound  = {
      id: `vehicle_${vehicle.id}`,
      url: xmrState.radioStationUrl || '',
      volume: 1,
      range: 10,
      source: {
        type: 'vehicle',
        id: vehicle.id
      },
      loop: false,
      position: vehicle.position,
      paused: false,
      startedAt: Date.now()
    };
  } else if (xmrState.toggle === false) {
    sound = null;
  } else {
    sound = vehicle.getVariable<IAudio3D>(EntitySharedDataType.SOUND);
    if (sound && xmrState.volume !== undefined) {
      sound.volume = xmrState.volume;
    }

    if (sound && xmrState.radioStationUrl !== undefined) {
      sound.url = xmrState.radioStationUrl;
      sound.startedAt = Date.now();
    }
  }

  console.log('updateVehicleXmr', sound);
  vehicle.setVariable(EntitySharedDataType.SOUND, sound);
}
