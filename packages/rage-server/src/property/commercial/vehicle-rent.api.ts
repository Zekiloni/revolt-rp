import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IVehicleRent, ProcedureKey } from '@revolt-rp/common';
import { getPropertyById } from '../property.service';
import { rentVehicle } from './vehicle-rent.service';


function rentVehicleHandler(data: IVehicleRent, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(data.propertyId)
    .then(property => rentVehicle(player, property, data.model, data.duration, data.payment));
}

on(ProcedureKey.SERVER_PROPERTY_RENT_VEHICLE, rentVehicleHandler);
