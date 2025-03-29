import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IVehicleRent, ProcedureKey } from '@revolt-rp/common';
import { checkVehicleRent, getRentedVehicle, rentVehicle } from './vehicle-rent.service';
import { getPropertyById } from '../property.service';


function rentVehicleHandler(data: IVehicleRent, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(data.propertyId)
    .then(property => rentVehicle(player, property, data.model, data.duration, data.payment));
}


setInterval(() => {
  getRentedVehicle()
    .then(vehicles => vehicles.forEach(vehicle => checkVehicleRent(vehicle)));
}, 60000);

on(ProcedureKey.SERVER_PROPERTY_RENT_VEHICLE, rentVehicleHandler);

