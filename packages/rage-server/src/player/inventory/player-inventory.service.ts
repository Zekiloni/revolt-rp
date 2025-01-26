import { t } from 'i18next';
import { Types } from 'mongoose';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { AnimationFlag, characterConfig, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { createItem, destroyItem, destroyItemById, getItemById, isWeaponItem } from '../../item/item.service';
import { playAnimation } from '../util/player-animation.util';
import { notifyPlayer } from '../util/player-notify.util';
import { Item } from '../../item/item.model';
import { P2P_MAX_DISTANCE } from '../player-interaction';


export const playerRemoveItemFromInventory = async (player: PlayerMp, itemId: string) => {
  player.character.inventory = player.character.inventory.filter(element => element.id !== itemId);
  await player.character.save();
  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_REMOVE_ITEM, itemId);
};

export const playerGetAvailableItemSlot = (player: PlayerMp) => {
  let localSlot = -1;

  for (let i = 0; i < characterConfig.maxInventoryItems; i++) {
    if (!player.character.inventory[i]) {
      localSlot = i;
      break;
    }
  }

  return localSlot;
};

export const playerGiveItem = async (player: PlayerMp, itemName: string, quantity: number) => {
  const availableItemSlot = playerGetAvailableItemSlot(player);

  if (availableItemSlot == -1)
    return;

  const item = await createItem(itemName, quantity, { localSlot: availableItemSlot });

  player.character.inventory.push(item);
  await player.character.save();

  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_ADD_ITEM, item);

  return item;
};

export const clearPlayerInventory = async (player: PlayerMp) => {
  player.character.inventory.forEach(destroyItem);
  player.character.inventory = [];
  await player.character.save();
};

export const removePlayerWeapons = async (player: PlayerMp) => {
  player.removeAllWeapons();

  const playerWeaponItems = player.character.inventory.filter(isWeaponItem)
    .map(item => item.id);

  const playerSelectedItemId = player.getVariable<string | null>(PlayerSharedDataType.SelectedItemId);
  if (playerWeaponItems.includes(playerSelectedItemId)) {
    const selectedItem = player.character.inventory.find(item => item.id === playerSelectedItemId) as Item | undefined;

    if (selectedItem && selectedItem.data && selectedItem.data.deselect) {
      selectedItem.data.deselect(player, selectedItem);
    }

    player.setVariable(PlayerSharedDataType.SelectedItemId, null);
  }

  player.character.inventory = player.character.inventory.filter(item => !playerWeaponItems.includes(item.id));
  await player.character.save();

  playerWeaponItems.forEach(destroyItemById);
};

export const isPlayerItemOwner = (player: PlayerMp, itemId: Types.ObjectId) => {
  return player.character.inventory.some(
    (item) => item instanceof Types.ObjectId ? item.equals(itemId) : item?._id.equals(itemId)
  );
};


export const playerDropItem = async (player: PlayerMp, itemId: string, position: Vector3, rotation: Vector3) => {
  const item: Item = await getItemById(itemId);

  if (!item)
    return;

  const itemHandler = item.data;

  if (!isPlayerItemOwner(player, item._id))
    return;

  const selectedItemId = player.getVariable<string | null>(PlayerSharedDataType.SelectedItemId);

  if (item.id === selectedItemId) {
    player.setVariable(PlayerSharedDataType.SelectedItemId, null);
    if (itemHandler && itemHandler.deselect) {
      itemHandler.deselect(player, item);
    }
  }

  item.dropped = true;
  item.position = position;
  item.rotation = rotation;
  item.dimension = player.dimension;

  item.object = mp.objects.new(mp.joaat(item.data.model), position, {
    rotation, dimension: item.dimension, alpha: 255
  });

  await item.save();

  await playerRemoveItemFromInventory(player, item.id);

  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_REMOVE_ITEM, item.id);
  playAnimation(player, 'random@domestic', 'pickup_low', AnimationFlag.NORMAL);
};


export const playerPickupItem = async (player: PlayerMp, itemId: string) => {
  const item = await getItemById(itemId);

  if (!item)
    return;

  if (!item.dropped)
    return;

  item.dropped = false;
  item.position = null;
  item.rotation = null;
  item.dimension = null;

  const object = item.object;

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

  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_UPDATE_ITEM, item);
};


export const playerSelectItem = (player: PlayerMp, slot: number) => {
  const selectedItemId = player.getVariable<string | null>(PlayerSharedDataType.SelectedItemId);

  if (selectedItemId != null) {
    const alreadySelectedItem = player.character.inventory.find((item: Item) => item.id === selectedItemId) as Item | undefined;
    if (alreadySelectedItem) {
      player.setVariable(PlayerSharedDataType.SelectedItemId, null);
      if (alreadySelectedItem.data && alreadySelectedItem.data.deselect) {
        alreadySelectedItem.data.deselect(player, alreadySelectedItem);
      }
    }
  }

  const item = player.character.inventory.find((item: Item) => item.localSlot === slot) as Item | undefined;

  if (!item)
    return;

  const itemHandler = item.data;

  if (itemHandler && itemHandler.select) {
    player.setVariable(PlayerSharedDataType.SelectedItemId, item.id);
    itemHandler.select(player, item);
  }
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

  console.log('playerGiveItemToPlayer', item);
  if (!item)
    return;

  const target = mp.players.at(targetId);

  if (!target || !target.character)
    return notifyPlayer(player, {
      severity: 'error',
      summary: t('not_found'),
      detail: t('player_not_online', { query: targetId })
    });

  if (player.dist(target.position) > P2P_MAX_DISTANCE)
    return notifyPlayer(player, { severity: 'error', detail: t('bad_request'), summary: t('target_not_close') });

  const itemHandler = item.data;

  if (quantity == item.quantity) {
    console.log('playerGiveItemToPlayer 1.1');
    await playerRemoveItemFromInventory(player, item.id);

    if (player.getVariable(PlayerSharedDataType.SelectedItemId) === item.id) {
      if (itemHandler && itemHandler.deselect) {
        itemHandler.deselect(player, item);
      }
    }
    console.log('playerGiveItemToPlayer 1.15');


    target.character.inventory.push(item);
    await target.character.save();
    console.log('playerGiveItemToPlayer 1.2');

    triggerBrowsers(target, ProcedureKey.BROWSER_INVENTORY_ADD_ITEM, item);
  } else {
    console.log('playerGiveItemToPlayer 2.1');

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
