import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@bcrp-rage/common';
import { playerChangeItemSlot, playerDropItem, playerPickupItem } from './player-inventory.service';


const playerDropItemHandler = async ({ itemId, position, rotation }: {
  itemId: string,
  position: Vector3,
  rotation: Vector3
}, { player }: ProcedureListenerInfo<PlayerMp>) => {
  await playerDropItem(player, itemId, position, rotation);
};

const playerPickupItemHandler = async (itemId: string, { player }: ProcedureListenerInfo<PlayerMp>) => {
  await playerPickupItem(player, itemId);
};

const playerChangeItemSlotHandler = async ([itemId, slot]: [string, number], { player }: ProcedureListenerInfo<PlayerMp>) => {
  await playerChangeItemSlot(player, itemId, slot);
}

on(ProcedureKey.SERVER_PLAYER_DROP_ITEM, playerDropItemHandler);
on(ProcedureKey.SERVER_PLAYER_PICKUP_ITEM, playerPickupItemHandler);
on(ProcedureKey.SERVER_PLAYER_CHANGE_ITEM_SLOT, playerChangeItemSlotHandler)
