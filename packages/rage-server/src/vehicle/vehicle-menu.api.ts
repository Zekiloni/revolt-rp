import { on, ProcedureListenerInfo, register, triggerBrowsers } from '@libertymp/rage-rpc';
import { IVehicleOption, ProcedureKey } from '@revolt-rp/common';
import { hasPlayerVehicleKeys, isPrivateVehicle, isRentVehicle } from './vehicle.service';


/**
 * Vehicle menu action item
 */
type VehicleMenuActionItem = {
  isSupported: (player: PlayerMp, vehicle: VehicleMp) => boolean;
  action: IVehicleOption;
}

/**
 * Vehicle menu actions
 */
const vehicleActions: VehicleMenuActionItem[] = [
  {
    isSupported: (player, vehicle) => isRentVehicle(vehicle) && hasPlayerVehicleKeys(player, vehicle) && !vehicle.info.admin,
    action: {
      label: 'return_rent_vehicle',
      icon: 'pi pi-undo',
      eventKey: ProcedureKey.SERVER_RETURN_RENT_VEHICLE
    }
  },
  {
    isSupported: (player, vehicle) => hasPlayerVehicleKeys(player, vehicle) && isPrivateVehicle(vehicle) && !vehicle.info.admin,
    action: {
      label: 'vehicle_park',
      icon: 'pi pi-car',
      eventKey: ProcedureKey.SERVER_PARK_VEHICLE
    }
  },
  {
    isSupported: (player, vehicle) => hasPlayerVehicleKeys(player, vehicle) && isPrivateVehicle(vehicle) && !vehicle.info.admin,
    action: {
      label: 'vehicle_sell_offer',
      icon: 'pi pi-dollar',
      eventKey: ProcedureKey.SERVER_VEHICLE_SELL_OFFER_DIALOG
    }
  }
];


/**
 * Get vehicle options handler
 * @param _args
 * @param player
 */
function getVehicleOptionsHandler(_args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  const vehicle = player.vehicle;

  if (!vehicle)
    return [];

  return vehicleActions
    .filter(({ isSupported }) => isSupported(player, vehicle))
    .map(({ action }) => action);
}


/**
 * Toggle vehicle sell offer dialog handler
 * @param _args
 * @param player
 */
function toggleVehicleSellOfferDialogHandler(_args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  triggerBrowsers(player, ProcedureKey.BROWSER_VEHICLE_SELL_OFFER_DIALOG, player.vehicle.info);
}

/**
 * Register vehicle menu procedures
 */
register(ProcedureKey.SERVER_GET_VEHICLE_OPTIONS, getVehicleOptionsHandler);
on(ProcedureKey.SERVER_VEHICLE_SELL_OFFER_DIALOG, toggleVehicleSellOfferDialogHandler);
