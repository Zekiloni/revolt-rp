import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import {
  getPlayerInventoryBankCards,
  getPlayerItemById,
  getPlayerSelectedItem,
  playerChangeItemSlot, playerDestroyItem,
  playerDropItem, playerGiveItemToPlayer,
  playerPickupItem,
  playerSelectItem,
  playerSplitItem, playerUseItem, syncDropItem
} from './player-inventory.service';


const playerDropItemHandler = async (itemId: string, { player }: ProcedureListenerInfo<PlayerMp>) => {
  await playerDropItem(player, itemId);
};

async function playerDroppedItemSyncHandler({ itemId, position, rotation }: {
  itemId: string,
  position: Vector3,
  rotation: Vector3
}, { player }: ProcedureListenerInfo<PlayerMp>) {
  await syncDropItem(player, itemId, position, rotation);
}

const playerPickupItemHandler = async (itemId: string, { player }: ProcedureListenerInfo<PlayerMp>) => {
  await playerPickupItem(player, itemId);
};

const playerChangeItemSlotHandler = async (data: [string, number], { player }: ProcedureListenerInfo<PlayerMp>) => {
  const [itemId, slot] = data;
  await playerChangeItemSlot(player, itemId, slot);
};

async function playerSelectItemHandler(slot: number, { player }: ProcedureListenerInfo<PlayerMp>) {
  await playerSelectItem(player, slot);
}

async function playerSplitItemHandler(data: [string, number], { player }: ProcedureListenerInfo<PlayerMp>) {
  const [itemId, splitQuantity] = data;
  await playerSplitItem(player, itemId, splitQuantity);
}

async function playerGiveItemToPlayerHandler(data: [number, string, number], { player }: ProcedureListenerInfo<PlayerMp>) {
  const [targetId, itemId, quantity] = data;
  await playerGiveItemToPlayer(player, targetId, itemId, quantity);
}

async function playerUseItemHandler(itemId: undefined | string, { player }: ProcedureListenerInfo<PlayerMp>) {
  if (itemId) {
    const item = getPlayerItemById(player, itemId);
    if (item) {
      await playerUseItem(player, item);
    }
    return;
  }

  const selectedItem = getPlayerSelectedItem(player);
  if (selectedItem) {
    await playerUseItem(player, selectedItem);
  }
}

async function playerEquipItemHandler(itemId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  const item = getPlayerItemById(player, itemId);
  if (item && item.data && item.data.isEquipable) {
    await playerUseItem(player, item);
  }
}

async function playerDestroyItemHandler(itemId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  await playerDestroyItem(player, itemId);
}

function playerGetInventoryBankCardsHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  return getPlayerInventoryBankCards(player);
}

on(ProcedureKey.SERVER_PLAYER_DROP_ITEM, playerDropItemHandler);
on(ProcedureKey.SERVER_PLAYER_PICKUP_ITEM, playerPickupItemHandler);
on(ProcedureKey.SERVER_PLAYER_CHANGE_ITEM_SLOT, playerChangeItemSlotHandler);
on(ProcedureKey.SERVER_PLAYER_SELECT_ITEM, playerSelectItemHandler);
on(ProcedureKey.SERVER_PLAYER_USE_ITEM, playerUseItemHandler);
on(ProcedureKey.SERVER_PLAYER_SPLIT_ITEM, playerSplitItemHandler);
on(ProcedureKey.SERVER_P2P_GIVE_ITEM, playerGiveItemToPlayerHandler);
on(ProcedureKey.SERVER_PLAYER_DESTROY_ITEM, playerDestroyItemHandler);
on(ProcedureKey.SERVER_PLAYER_EQUIP_ITEM, playerEquipItemHandler);
on(ProcedureKey.SERVER_DROPPED_ITEM_SYNC, playerDroppedItemSyncHandler);

register(ProcedureKey.SERVER_PLAYER_INVENTORY_GET_BANK_CARDS, playerGetInventoryBankCardsHandler);
