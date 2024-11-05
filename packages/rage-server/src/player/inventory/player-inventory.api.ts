import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@bcrp-rage/common';
import {
  playerChangeItemSlot,
  playerDropItem,
  playerPickupItem,
  playerSelectItem,
  playerSplitItem
} from './player-inventory.service';


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

const playerChangeItemSlotHandler = async (data: [string, number], { player }: ProcedureListenerInfo<PlayerMp>) => {
  const [itemId, slot] = data;
  await playerChangeItemSlot(player, itemId, slot);
};

function playerSelectItemHandler(slot: number, { player }: ProcedureListenerInfo<PlayerMp>) {
  playerSelectItem(player, slot);
}

async function playerSplitItemHandler(data: [string, number], { player }: ProcedureListenerInfo<PlayerMp>) {
  const [itemId, splitQuantity] = data;
  await playerSplitItem(player, itemId, splitQuantity);
}

on(ProcedureKey.SERVER_PLAYER_DROP_ITEM, playerDropItemHandler);
on(ProcedureKey.SERVER_PLAYER_PICKUP_ITEM, playerPickupItemHandler);
on(ProcedureKey.SERVER_PLAYER_CHANGE_ITEM_SLOT, playerChangeItemSlotHandler);
on(ProcedureKey.SERVER_PLAYER_SELECT_ITEM, playerSelectItemHandler);
on(ProcedureKey.SERVER_PLAYER_SPLIT_ITEM, playerSplitItemHandler);
