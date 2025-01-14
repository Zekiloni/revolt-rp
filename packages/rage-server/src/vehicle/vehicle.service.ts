// import { IVehicle } from '@revolt-rp/common';
//
//
// export const createVehicle = (model: string, position: Vector3, temporary: boolean, options: IVehicle) => {
//
//
//
// }


import { VehicleSharedDataType } from '@revolt-rp/common';
import { VehicleModel } from './vehicle.model';


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
