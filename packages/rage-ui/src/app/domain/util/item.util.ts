import { IBaseItem, IItem, IProduct, ItemType, IWearableInfo, IWearableItem } from '@revolt-rp/common';

function hasWearableInfo(item: IItem | IProduct): item is IItem & { wearableInfo: IWearableInfo } {
  return 'wearableInfo' in item && !!item.wearableInfo;
}

function isEquipableItem(item: IItem | IProduct): item is IItem & { data: IWearableItem } {
  return !!item.data && Array.isArray(item.data.type) && item.data.type.includes(ItemType.EQUIPABLE);
}

export const isWearableItem = (item: IItem | IProduct) => {
  return isEquipableItem(item) && hasWearableInfo(item);
};

export const getItemIcon = (item: IItem | IProduct) => {
  const data = item.data as IBaseItem;

  if (data.icon) {
    return `assets/images/items/${data.icon}.png`;
  }

  if (isWearableItem(item)) {
    const wearableInfo = (<IItem>item).wearableInfo as IWearableInfo;
    const baseItem = item.data as IWearableItem;
    return `${wearableInfo.model}_${baseItem.wearableType}_${baseItem.componentId}_${wearableInfo.drawable}_${wearableInfo.texture}_${wearableInfo.texture}`;
  }

  return `assets/images/items/${data.model}.png`;
};


export const getClothingIcon = (ped: string, type: 'clothing' | 'prop', componentId: number, drawable: number, texture: number) => {
  const icon = `${ped}_${type}_${componentId}_${drawable}_${texture}_${texture}`;
  return `assets/images/items/${icon}.png`;
}
