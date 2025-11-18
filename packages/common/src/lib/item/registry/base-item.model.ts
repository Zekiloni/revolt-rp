import { ItemType } from './item-type';

export interface IBaseItem {
  name: string;
  description: string;
  type: ItemType[];
  weight: number;
  unitOfMeasure?: 'piece' | 'kg' | 'g' | 'lb' | 'oz' | 'liter' | 'ml' | 'count';
  icon?: string;
  model: string;
  isStackable: boolean;
  isWeapon: boolean;
  isEquipable: boolean;
  isBankCard: boolean;
  isAmmo: boolean;

}

export interface IUsableItem<TPlayer, TItem> extends IBaseItem {
  use(player: TPlayer, item: TItem): Promise<void> | void;
  stopUse?(player: TPlayer, item: TItem): void;
  canUse?(player: TPlayer, item: TItem): boolean;
}

export interface ISelectableItem<TPlayer, TItem> extends IBaseItem {
  select(player: TPlayer, item: TItem): void;
  deselect?(player: TPlayer, item: TItem): void;
}

export interface IEquipableItem<TPlayer, TItem> extends IBaseItem {
  equip(player: TPlayer, item: TItem): void;
  unequip?(player: TPlayer, item: TItem): void;
}

export interface ISelectableUsableItem<TPlayer, TItem>
  extends ISelectableItem<TPlayer, TItem>, IUsableItem<TPlayer, TItem> {}
