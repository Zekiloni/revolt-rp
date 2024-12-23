// import { IVehicle } from '@bcrp-rage/common';
//
//
// export const createVehicle = (model: string, position: Vector3, temporary: boolean, options: IVehicle) => {
//
//
//
// }


import { VehicleSharedDataType } from '@bcrp-rage/common';
import { VehicleModel } from './vehicle.model';


export const isTemporaryVehicle = (vehicle: VehicleMp) => {
  return vehicle.getVariable<boolean>(VehicleSharedDataType.IsTemporary);
};

export const getVehicleId = (vehicle: VehicleMp) => {
  const id = vehicle.getVariable<string | undefined>(VehicleSharedDataType.VehicleId);

  if (!id)
    throw new Error(`Vehicle ${vehicle.id} ID not found`);

  return id;
};

export const saveVehicle = async (vehicle: VehicleMp) => {
  await VehicleModel.findByIdAndUpdate(getVehicleId(vehicle), {

  });
}


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
