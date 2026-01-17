import { Item, ItemModel } from '@revolt-rp/core';
import { ItemSharedDataType } from '@revolt-rp/common';


export const getItemObject = (item: Item) => {
  return mp.objects.toArray()
    .find(object => object.getVariable(ItemSharedDataType.ItemId) === item.id);
};

export const setItemObject = (item: Item, object: ObjectMp) => {
  object.setVariable(ItemSharedDataType.ItemId, item.id);
};

export const getAllDroppedItems = async () => {
  return ItemModel.find({ dropped: true }).exec();
};

export const getItemById = (id: string) => {
  return ItemModel.findById(id);
};

export const createItem = (itemName: string, quantity: number, options: Partial<Item> = {}) => {
  return ItemModel.create({ ...options, name: itemName, quantity });
};


export const destroyItem = async (item: Item) => {
  const object = getItemObject(item);
  if (object && mp.objects.exists(object)) {
    object.destroy();
  }

  await item.delete();
};

export const destroyItemById = async (id: string) => {
  const item = await getItemById(id);
  if (!item)
    return;

  await destroyItem(item);
};


export const isWeaponItem = async (item: Item) => {
  return item.data.isWeapon;
};


export const getNearbyItem = async (player: PlayerMp, radius: number) => {
  const items = await getAllDroppedItems();
  return items.reduce((closestItem, item) => {
    const distance = player.dist(item.position);
    return (distance <= radius && (!closestItem || distance < player.dist(closestItem.position))) ? item : closestItem;
  }, null);
};
