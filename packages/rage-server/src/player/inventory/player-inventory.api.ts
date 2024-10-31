import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@bcrp-rage/common';
import { playerDropItem, playerGetInventory, playerPickupItem } from './player-inventory.service';


function playerGetInventoryHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  return playerGetInventory(player);
}

const playerDropItemHandler = async ({ itemId, position, rotation }: {
  itemId: string,
  position: Vector3,
  rotation: Vector3
}, { player }: ProcedureListenerInfo<PlayerMp>) => {
  return playerDropItem(player, itemId, position, rotation);
};


const playerPickupItemHandler = async (itemId: string, { player }: ProcedureListenerInfo<PlayerMp>) => {
  await playerPickupItem(player, itemId);
};


register(ProcedureKey.SERVER_PLAYER_GET_INVENTORY, playerGetInventoryHandler)
register(ProcedureKey.SERVER_PLAYER_DROP_ITEM, playerDropItemHandler);
on(ProcedureKey.SERVER_PLAYER_PICKUP_ITEM, playerPickupItemHandler);
