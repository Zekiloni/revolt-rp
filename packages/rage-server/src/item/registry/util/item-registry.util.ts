import { BaseItem, itemRegistry } from '../base-item.model';
import { ItemType } from '@revolt-rp/common';


export const isValidItem = (itemName: string) => itemRegistry.get(itemName) != undefined;


export const getBaseItem = (itemName: string) => itemRegistry.get(itemName);

export const filterItemsByType = (type: ItemType): BaseItem[] => {
  return [...itemRegistry.values()].filter(item => item.type.includes(type));
}
