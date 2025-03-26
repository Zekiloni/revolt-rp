import { VehicleSharedDataType } from '@revolt-rp/common';


export const isVehicleTrunkOpened = (vehicle: VehicleMp) => {
  return vehicle.getVariable<boolean>(VehicleSharedDataType.Trunk) || false;
};
