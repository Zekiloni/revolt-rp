import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { IVehicleOption, ProcedureKey } from '@revolt-rp/common';
import { hasPlayerVehicleKeys, isRentVehicle } from './vehicle.service';


const vehicleActions: { isSupported: (player: PlayerMp, vehicle: VehicleMp) => boolean, action: IVehicleOption }[] = [
  {
    isSupported: (player, vehicle) => isRentVehicle(vehicle) && hasPlayerVehicleKeys(player, vehicle),
    action: {
      label: 'return_rent_vehicle',
      icon: 'pi pi-undo',
      eventKey: ProcedureKey.SERVER_RETURN_RENT_VEHICLE
    }
  },
  {
    isSupported: (player, vehicle) => hasPlayerVehicleKeys(player, vehicle),
    action: {
      label: 'vehicle_park',
      icon: 'pi pi-car',
      eventKey: ProcedureKey.SERVER_PARK_VEHICLE
    }
  }
];


function getVehicleOptionsHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  const vehicle = player.vehicle;

  if (!vehicle)
    return [];

  return vehicleActions
    .filter(({ isSupported }) => isSupported(player, vehicle))
    .map(({ action }) => action);
}


register(ProcedureKey.SERVER_GET_VEHICLE_OPTIONS, getVehicleOptionsHandler);
