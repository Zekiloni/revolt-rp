import { IVehicle, VehicleSharedDataType } from '@revolt-rp/common';
import { VehicleModel } from './vehicle.model';
import { createDefaultVehicleInfo } from './vehicle.util';

export const temporaryVehicles: Map<number, IVehicle> = new Map();


export const createTemporaryVehicle = (model: string, position: Vector3, options: Partial<IVehicle>) => {
  const vehicle = mp.vehicles.new(mp.joaat(model), position);

  vehicle.engine = false;
  vehicle.rotation = new mp.Vector3(options.rotation.x || 0, options.rotation.y || 0, options.rotation.z || 0);
  const info = createDefaultVehicleInfo(options, model, position, vehicle);

  loadVehicleVariables(vehicle, info);

  temporaryVehicles.set(vehicle.id, info);

  return vehicle;
};


function loadVehicleVariables(vehicle: VehicleMp, info: IVehicle) {
  vehicle.setVariables({
    [VehicleSharedDataType.Engine]: info.engine,
    [VehicleSharedDataType.IsTemporary]: info.isTemporary,
    [VehicleSharedDataType.VehicleId]: info.id || undefined
  });
}

export const isTemporaryVehicle = (vehicle: VehicleMp) => {
  return vehicle.getVariable<boolean>(VehicleSharedDataType.IsTemporary);
};

export const getVehicleId = (vehicle: VehicleMp) => {
  return vehicle.getVariable<string | undefined>(VehicleSharedDataType.VehicleId);
};

export const saveVehicle = async (vehicle: VehicleMp) => {
  const vehicleId = getVehicleId(vehicle);

  if (!vehicleId)
    return;

  await VehicleModel.findByIdAndUpdate(vehicleId, {});
};


export const hasPlayerVehicleKeys = (player: PlayerMp, vehicle: VehicleMp) => {
  //
};

export const toggleVehicleEngine = (vehicle: VehicleMp) => {
  // TODO: modify this later
  if (vehicle.engineHealth < 300)
    return;

  vehicle.engine = !vehicle.engine;
  vehicle.setVariable(VehicleSharedDataType.Engine, vehicle.engine);

  if (!isTemporaryVehicle(vehicle)) {
    //
  }
};
