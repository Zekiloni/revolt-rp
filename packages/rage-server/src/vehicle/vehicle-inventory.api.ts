import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import {
  getTrunkItemById,
  getVehicleTrunk,
  playerPutTrunkItem,
  playerTakeTrunkItem
} from './vehicle-inventory.service';
import { getPlayerItemById } from '../player/inventory/player-inventory.service';


function getVehicleTrunkHandler(vehicleId: number) {
  return getVehicleTrunk(mp.vehicles.at(vehicleId));
}

async function vehicleTrunkPutItemHandler(data: [number, string], { player }: ProcedureListenerInfo<PlayerMp>) {
  const [vehicleId, itemId] = data;
  return playerPutTrunkItem(player, mp.vehicles.at(vehicleId), getPlayerItemById(player, itemId));
}

async function vehicleTrunkTakeItemHandler(data: [number, string], { player }: ProcedureListenerInfo<PlayerMp>) {
  const [vehicleId, itemId] = data;

  const vehicle = mp.vehicles.at(vehicleId);

  if (!vehicle)
    throw new Error('vehicle_not_found');

  return playerTakeTrunkItem(player, vehicle, getTrunkItemById(vehicle, itemId));
}


register(ProcedureKey.SERVER_GET_VEHICLE_TRUNK, getVehicleTrunkHandler);
register(ProcedureKey.SERVER_VEHICLE_TRUNK_PUT_ITEM, vehicleTrunkPutItemHandler);
register(ProcedureKey.SERVER_VEHICLE_TRUNK_TAKE_ITEM, vehicleTrunkTakeItemHandler);
