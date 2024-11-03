import { Types } from 'mongoose';
import { createItem, getItemById } from '../../item/item.service';
import { Item } from '../../item/item.model';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { characterConfig, ProcedureKey } from '@bcrp-rage/common';

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
  const startTime = Date.now(); // Start timing

  const availableItemSlot = playerGetAvailableItemSlot(player);

  if (availableItemSlot == -1)
    return;

  const item = await createItem(itemName, quantity, { localSlot: availableItemSlot });

  player.character.inventory.push(item)
  await player.character.save();

  console.log(player.character.inventory)
  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_ADD_ITEM, item);

  const endTime = Date.now();
  console.log(`Total execution time: ${endTime - startTime}ms`);

  return item;
};

export const isPlayerItemOwner = (player: PlayerMp, itemId: Types.ObjectId) => {
  return player.character.inventory.some(
    (item) => item instanceof Types.ObjectId ? item.equals(itemId) : item?._id.equals(itemId)
  );
};


export const playerDropItem = async (player: PlayerMp, itemId: string, position: Vector3, rotation: Vector3) => {
  const item = await getItemById(itemId);

  if (!item)
    return;

  if (!isPlayerItemOwner(player, item._id))
    return;

  item.dropped = true;
  item.position = position;
  item.rotation = rotation;
  item.dimension = player.dimension;

  item.object = mp.objects.new(mp.joaat(item.data.model), position, {
    rotation, dimension: item.dimension, alpha: 255
  });

  await item.save();

  const idx = player.character.inventory.findIndex((item: Item) => item.id == itemId);

  if (idx != -1) {
    player.character.inventory.splice(idx, 1);
    await player.character.save();
  }

  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_REMOVE_ITEM, item.id);
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

  player.character.inventory.push(item)
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
