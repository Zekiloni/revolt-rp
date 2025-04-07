import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IDealershipCheckout, ProcedureKey } from '@revolt-rp/common';
import { buyVehicle } from './vehicle-dealership.service';
import { getPropertyById } from '../property.service';


function dealershipBuyVehicleHandler(checkout: IDealershipCheckout, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(checkout.propertyId)
    .then(property => buyVehicle(player, property, checkout.vehicle, checkout.payment));
}

on(ProcedureKey.SERVER_VEHICLE_DEALERSHIP_BUY, dealershipBuyVehicleHandler);
