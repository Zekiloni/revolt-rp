import { IBaseItem, IEquipableItem, ISelectableItem, ItemType, IUsableItem } from '@revolt-rp/common';
import { BaseItem, itemRegistry } from '../model/base-item.model';


export const isValidItem = (itemName: string) => itemRegistry.get(itemName) != undefined;

export const getAllBaseItems = () => [...itemRegistry.values()];

export const getAllBaseItemModels = () => getAllBaseItems().map(item => item.model);

export const getBaseItem = <T = BaseItem>(itemName: string) => itemRegistry.get(itemName) as T;

export const filterItemsByType = (type: ItemType): IBaseItem[] => {
  return [...itemRegistry.values()].filter(item => item.type.includes(type));
};


export function isUsableItem<
  TPlayer = unknown,
  TItem = unknown
>(
  item: IBaseItem
): item is IUsableItem<TPlayer, TItem> {
  return (
    typeof item === 'object' &&
    item !== null &&
    'use' in item &&
    typeof (item as Record<string, unknown>).use === 'function'
  );
}

export function isSelectableItem<
  TPlayer = unknown,
  TItem = unknown
>(
  item: IBaseItem
): item is ISelectableItem<TPlayer, TItem> {
  return (
    typeof item === 'object' &&
    item !== null &&
    'select' in item &&
    typeof (item as Record<string, unknown>).use === 'function'
  );
}

export function isEquipableItem<
  TPlayer = unknown,
  TItem = unknown
>(
  item: IBaseItem
): item is IEquipableItem<TPlayer, TItem> {
  return (
    typeof item === 'object' &&
    item !== null &&
    'equip' in item &&
    typeof (item as Record<string, unknown>).equip === 'function'
  );
}

