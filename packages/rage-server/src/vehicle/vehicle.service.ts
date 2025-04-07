import {
  GameUiKey,
  IVehicle,
  ProcedureKey,
  VehicleIndicator,
  VehicleSharedDataType
} from '@revolt-rp/common';
import { Vehicle, VehicleModel } from './vehicle.model';
import { createDefaultVehicleInfo } from './vehicle.util';
import { Character } from '../player/character/character.model';
import { showPlayerGameInterface } from '../player/util/player.util';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { vehicleConfig } from './vehicle.config';
import { FilterQuery } from 'mongoose';


export const findAllVehicles = async (filterQuery?: FilterQuery<Vehicle>) => {
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
  vehicle.info.color = [vehicle.getColorRGB(0), vehicle.getColorRGB(1)];
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

  vehicle.info = new VehicleModel(createDefaultVehicleInfo(options, model, position, vehicle, false));
  await vehicle.info.save();

  vehicle.info.locked = vehicle.locked;
  vehicle.info.color = [vehicle.getColorRGB(0), vehicle.getColorRGB(1)];
  vehicle.info.position = position;

  if (options && options.numberplate) {
    vehicle.numberPlate = options.numberplate.numberplate ?? '';
    vehicle.numberPlateType = options.numberplate.modelType ?? vehicleConfig.defaultNumberPlateType;
  }

  loadVehicleVariables(vehicle, vehicle.info);

  return vehicle;
};

export const loadVehicle = (vehicle: Vehicle) => {
  const position = new mp.Vector3(vehicle.position.x, vehicle.position.y, vehicle.position.z);
  const rotation = new mp.Vector3(vehicle.rotation.x, vehicle.rotation.y, vehicle.rotation.z);

  const vehicleMp = mp.vehicles.new(mp.joaat(vehicle.model), position, {
    heading: vehicle.rotation.z,
    engine: false,
    color: vehicle.color,
    locked: vehicle.locked
  });

  vehicle.rotation = rotation;

  if (vehicle.numberplate) {
    vehicleMp.numberPlate = vehicle.numberplate.numberplate ?? '';
    vehicleMp.numberPlateType = vehicle.numberplate.modelType ?? vehicleConfig.defaultNumberPlateType;
  }

  loadVehicleVariables(vehicleMp, vehicleMp.info);
};

export const setVehicleOwner = (vehicle: VehicleMp, character: Character) => {
  vehicle.info.owner = character;
};

function loadVehicleVariables(vehicle: VehicleMp, info: IVehicle) {
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

export const isTemporaryVehicle = (vehicle: VehicleMp) => {
  return vehicle.getVariable<boolean>(VehicleSharedDataType.IsTemporary);
};

export const isRentVehicle = (vehicle: VehicleMp) => {
  return vehicle.info.rented;
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
  return vehicle.info.owner.id === player.character.id;
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
