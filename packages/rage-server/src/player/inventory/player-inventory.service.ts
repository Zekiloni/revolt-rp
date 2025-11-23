import { t } from 'i18next';
import { Types } from 'mongoose';
import { triggerBrowsers, triggerClient } from '@libertymp/rage-rpc';
import {
  AnimationFlag,
  characterConfig,
  ISelectableItem,
  ItemType,
  PlayerSharedDataType,
  ProcedureKey
} from '@revolt-rp/common';
import { isSelectableItem, isUsableItem, Item } from '@revolt-rp/core';
import {
  createItem,
  destroyItem,
  destroyItemById,
  getItemById,
  getItemObject,
  isWeaponItem, setItemObject
} from '../../item/item.service';
import { playAnimation } from '../util/player-animation.util';
import { notifyPlayer } from '../util/player-notify.util';
import { P2P_MAX_DISTANCE } from '../player-interaction';
import { WearableItem } from '../../item/registry/clothing/wearable-item.model';


export const getPlayerSelectedItem = (player: PlayerMp) => {
  const selectedItemId = player.getVariable<string | null>(PlayerSharedDataType.SelectedItemId);

  if (!selectedItemId)
    return null;

  const item = player.character.inventory.find((item: Item) => item.id === selectedItemId) as Item;
  return item ? item : null;
};


export const getPlayerItemById = (player: PlayerMp, itemId: string) => {
  return player.character.inventory.find((item: Item) => item.id === itemId) as Item | undefined;
};

export const getPlayerItemBySlot = (player: PlayerMp, slot: number) => {
  return player.character.inventory.find((item: Item) => item.localSlot === slot) as Item | undefined;
};

export const getPlayerItemByType = (player: PlayerMp, type: ItemType) => {
  return player.character.inventory.find((item: Item) => item.data.type.includes(type)) as Item | undefined;
};


export const playerRemoveItemFromInventory = async (player: PlayerMp, itemId: string) => {
  player.character.inventory = player.character.inventory.filter(element => element.id !== itemId);
  await player.character.save();
  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_REMOVE_ITEM, itemId);
};

export const playerGetAvailableItemSlot = (player: PlayerMp) => {
  const occupiedSlots = new Set(
    player.character.inventory
      .filter((item: Item) => item && item.localSlot != null)
      .map((item: Item) => item.localSlot)
  );

  for (let i = 0; i < characterConfig.maxInventoryItems; i++) {
    if (!occupiedSlots.has(i)) {
      return i;
    }
  }

  return -1;
};

export const playerGiveItem = async (player: PlayerMp, itemName: string, quantity: number, options: Partial<Item> = {}) => {
  const availableItemSlot = playerGetAvailableItemSlot(player);

  if (availableItemSlot == -1)
    return;

  const item = await createItem(itemName, quantity, { ...options, localSlot: availableItemSlot });

  player.character.inventory.push(item);
  await player.character.save();

  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_ADD_ITEM, item);

  return item;
};

export const clearPlayerInventory = async (player: PlayerMp) => {
  player.character.inventory.forEach((item: Item) => {
    const itemHandler = item.data;
    if (item.equipped && itemHandler.isEquipable) {
      const wearableItem = itemHandler as WearableItem;
      item.equipped = false;
      if (wearableItem.unequip)
        (<WearableItem>itemHandler).unequip(player, item);
    }
    destroyItem(item);
  });

  player.character.inventory = [];
  await player.character.save();

  triggerBrowsers(player, ProcedureKey.BROWSER_SET_INVENTORY, player.character.inventory);
};

export const removePlayerWeapons = async (player: PlayerMp) => {
  player.removeAllWeapons();

  const playerWeaponItems = player.character.inventory.filter(isWeaponItem)
    .map(item => item.id);

  const playerSelectedItemId = player.getVariable<string | null>(PlayerSharedDataType.SelectedItemId);
  if (playerWeaponItems.includes(playerSelectedItemId)) {
    const selectedItem = player.character.inventory.find(item => item.id === playerSelectedItemId) as Item | undefined;

    if (selectedItem && selectedItem.data && isSelectableItem<PlayerMp, Item>(selectedItem.data) && (<ISelectableItem<PlayerMp, Item>>selectedItem.data).deselect) {
      (<ISelectableItem<PlayerMp, Item>>selectedItem.data).deselect(player, selectedItem);
    }

    player.setVariable(PlayerSharedDataType.SelectedItemId, null);
  }

  player.character.inventory = player.character.inventory.filter(item => !playerWeaponItems.includes(item.id));
  await player.character.save();

  triggerBrowsers(player, ProcedureKey.BROWSER_SET_INVENTORY, player.character.inventory);
  playerWeaponItems.forEach(destroyItemById);
};

export const isPlayerItemOwner = (player: PlayerMp, itemId: Types.ObjectId | string) => {
  return player.character.inventory.some(
    (item) => item instanceof Types.ObjectId ? item.equals(itemId) : item?._id.equals(itemId)
  );
};


export const playerDropItem = async (player: PlayerMp, itemId: string) => {
  const item: Item = await getItemById(itemId);

  if (!item)
    return;

  const itemHandler = item.data;

  if (!isPlayerItemOwner(player, item._id))
    return;

  const selectedItemId = player.getVariable<string | null>(PlayerSharedDataType.SelectedItemId);

  if (item.id === selectedItemId) {
    player.setVariable(PlayerSharedDataType.SelectedItemId, null);
    if (itemHandler && isSelectableItem<PlayerMp, Item>(itemHandler) && (<ISelectableItem<PlayerMp, Item>>itemHandler).deselect) {
      (<ISelectableItem<PlayerMp, Item>>itemHandler).deselect(player, item);
    }
  }

  if (item.equipped && itemHandler.isEquipable) {
    const wearableItem = itemHandler as WearableItem;
    item.equipped = false;
    if (wearableItem.unequip)
      (<WearableItem>itemHandler).unequip(player, item);
  }

  item.dropped = true;
  item.dimension = player.dimension;
  item.localSlot = null;

  await item.save();

  await playerRemoveItemFromInventory(player, item.id);

  mp.players.forEachInRange(player.position, 50.0, (target) => {
    if (player.dimension !== target.dimension)
      return;

    triggerClient(target, ProcedureKey.CLIENT_PLAYER_DROP_ITEM, { playerRemoteId: player.id, item });
  });

  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_REMOVE_ITEM, item.id);
  playAnimation(player, 'random@domestic', 'pickup_low', AnimationFlag.NORMAL);
};


export const syncDropItem = async (player: PlayerMp, itemId: string, position: Vector3, rotation: Vector3) => {
  const item: Item = await getItemById(itemId);

  if (!item)
    return;

  item.position = position;
  item.rotation = rotation;


  const object = mp.objects.new(mp.joaat(item.data.model), position, {
    rotation, dimension: item.dimension, alpha: 255
  });

  setItemObject(item, object);

  await item.save();
};

export const playerPickupItem = async (player: PlayerMp, itemId: string) => {
  const availableItemSlot = playerGetAvailableItemSlot(player);

  if (availableItemSlot == -1)
    return;

  const item = await getItemById(itemId);

  if (!item)
    return;

  if (!item.dropped)
    return;

  item.dropped = false;
  item.position = null;
  item.rotation = null;
  item.dimension = null;
  item.localSlot = availableItemSlot;

  const object = getItemObject(item);

  if (object && mp.objects.exists(object.id)) {
    object.destroy();
  }

  await item.save();

  player.character.inventory.push(item);
  await player.character.save();

  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_ADD_ITEM, item);
};


export const playerChangeItemSlot = async (player: PlayerMp, itemId: string, slot: number) => {
  const item = player.character.inventory.find((item: Item) => item && item.id === itemId) as (Item | undefined);
  const itemOnSlot = player.character.inventory.find((item: Item) => item.localSlot == slot) as (Item | undefined);

  if (!item)
    return;

  if (itemOnSlot) {
    itemOnSlot.localSlot = item.localSlot;
    await itemOnSlot.save();
    triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_UPDATE_ITEM, itemOnSlot);
  }

  item.localSlot = slot;
  await item.save();

  if (getPlayerSelectedItem(player)?.id === item.id) {
    if (item.localSlot > 5) {
      const itemHandler = item.data;
      if (itemHandler &&  isSelectableItem<PlayerMp, Item>(itemHandler)) {
        (<ISelectableItem<PlayerMp, Item>>itemHandler).deselect(player, item);
      }
    }
  }

  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_UPDATE_ITEM, item);
};


export const playerSelectItem = async (player: PlayerMp, slot: number) => {
  const alreadySelectedItem = getPlayerSelectedItem(player);
  const item = getPlayerItemBySlot(player, slot);

  if (alreadySelectedItem) {
    player.setVariable(PlayerSharedDataType.SelectedItemId, null);
    if (alreadySelectedItem.data && isSelectableItem<PlayerMp, Item>(alreadySelectedItem.data) && (<ISelectableItem<PlayerMp, Item>>alreadySelectedItem.data).deselect) {
      (<ISelectableItem<PlayerMp, Item>>alreadySelectedItem.data).deselect(player, alreadySelectedItem);
      await alreadySelectedItem.save();
    }

    if (item && alreadySelectedItem.id === item.id) {
      return;
    }
  }

  console.log('Selecting item in slot:', slot, 'Item:', item ? item.name : 'None');
  if (!item)
    return;

  const itemHandler = item.data;

  console.log('Item handler:', itemHandler ? itemHandler.name : 'None');
  if (itemHandler && isSelectableItem<PlayerMp, Item>(itemHandler)) {
    player.setVariable(PlayerSharedDataType.SelectedItemId, item.id);
    (<ISelectableItem<PlayerMp, Item>>itemHandler).select(player, item);
  }

  await item.save();
};


export const playerSplitItem = async (player: PlayerMp, itemId: string, splitQuantity: number) => {
  const item = player.character.inventory.find((item: Item) => item && item.id === itemId) as (Item | undefined);

  if (!item)
    return;

  const itemHandler = item.data;

  if (!itemHandler.isStackable)
    return notifyPlayer(player, {
      severity: 'error',
      summary: t('bad_request'),
      detail: t('item_not_stackable', { name: itemHandler.name })
    });

  if (splitQuantity >= item.quantity)
    return notifyPlayer(player, {
      severity: 'error',
      summary: t('bad_request'),
      detail: t('not_enough_quantity')
    });

  item.quantity = (item.quantity - splitQuantity);
  await item.save();

  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_UPDATE_ITEM, item);

  await playerGiveItem(player, item.name, splitQuantity);
};


export const playerGiveItemToPlayer = async (player: PlayerMp, targetId: number, itemId: string, quantity: number) => {
  const item = player.character.inventory.find((item: Item) => item && item.id === itemId) as (Item | undefined);

  if (!item)
    return;

  const target = mp.players.at(targetId);

  if (!target || !target.character)
    return notifyPlayer(player, {
      severity: 'error',
      summary: t('not_found'),
      detail: t('player_not_online', { query: targetId })
    });

  const availableItemSlot = playerGetAvailableItemSlot(target);

  if (availableItemSlot == -1)
    return notifyPlayer(player, {
      severity: 'error',
      summary: t('bad_request'),
      detail: t('target_inventory_full')
    });

  if (player.dist(target.position) > P2P_MAX_DISTANCE)
    return notifyPlayer(player, { severity: 'error', summary: t('bad_request'), detail: t('target_not_close') });

  const itemHandler = item.data;

  if (quantity == item.quantity) {
    await playerRemoveItemFromInventory(player, item.id);

    if (player.getVariable(PlayerSharedDataType.SelectedItemId) === item.id) {
      if (itemHandler && isSelectableItem(itemHandler)) {
        (<ISelectableItem<PlayerMp, Item>>itemHandler).deselect(player, item);
      }
    }

    if (item.equipped && itemHandler.isEquipable) {
      const wearableItem = itemHandler as WearableItem;
      item.equipped = false;
      if (wearableItem.unequip)
        (<WearableItem>itemHandler).unequip(player, item);
    }

    target.character.inventory.push(item);
    await target.character.save();

    triggerBrowsers(target, ProcedureKey.BROWSER_INVENTORY_ADD_ITEM, item);
  } else {
    if (!itemHandler.isStackable)
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('item_not_stackable', { name: itemHandler.name })
      });

    if (quantity >= item.quantity)
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('not_enough_quantity')
      });
  }
};


export const playerDestroyItem = async (player: PlayerMp, itemId: string) => {
  const item = getPlayerItemById(player, itemId);

  if (item) {
    const selectedItem = getPlayerSelectedItem(player);

    if (selectedItem && item.id === selectedItem.id) {
      if (item.data && isSelectableItem<PlayerMp, Item>(item.data) && (<ISelectableItem<PlayerMp, Item>>item.data).deselect) {
        (<ISelectableItem<PlayerMp, Item>>item.data).deselect(player, item);
      }
    }

    await destroyItem(item);
    await playerRemoveItemFromInventory(player, itemId);
  }
};


export const playerUseItem = async (player: PlayerMp, item: Item) => {
  const itemHandler = item.data;

  if (itemHandler && isUsableItem<PlayerMp, Item>(itemHandler)) {
    itemHandler.use(player, item);
    triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_UPDATE_ITEM, item);
  }
};

export const getPlayerByItemId = async (itemId: string) => {
  return mp.players.toArray().find(player => player.character != undefined && isPlayerItemOwner(player, itemId));
};


export const getPlayerInventoryBankCards = (player: PlayerMp) => {
  return player.character.inventory.filter((item: Item) => item.data && item.data.isBankCard);
};
