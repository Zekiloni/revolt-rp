import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IVehicleRent, ProcedureKey } from '@revolt-rp/common';
import { checkVehicleRent, rentVehicle, returnVehicle } from './vehicle-rent.service';
import { getPropertyById } from '../property.service';
import { isRentVehicle } from '../../vehicle/vehicle.service';


function rentVehicleHandler(data: IVehicleRent, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(data.propertyId)
    .then(property => rentVehicle(player, property, data.model, data.duration, data.payment));
}

async function returnVehicleHandler(_args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  if (player.vehicle)
    await returnVehicle(player.vehicle);
}

setInterval(() => {
  mp.vehicles.toArray()
    .filter(vehicle => isRentVehicle(vehicle))
    .forEach(vehicle => checkVehicleRent(vehicle));
}, 60000);


on(ProcedureKey.SERVER_PROPERTY_RENT_VEHICLE, rentVehicleHandler);
on(ProcedureKey.SERVER_RETURN_RENT_VEHICLE, returnVehicleHandler);
