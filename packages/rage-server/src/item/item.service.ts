import { Item, ItemModel } from './item.model';


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
  const object = item.object;
  if (object && mp.objects.exists(object)) {
    object.destroy();
  }

  await item.delete();
};


export const isWeaponItem = async (item: Item) => {
  return item.data.isWeapon;
}



