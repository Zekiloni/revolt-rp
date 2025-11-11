import { IBaseItem, ItemType } from '@revolt-rp/common';

export const NOT_STACKABLE_ITEM_TYPES = [
  ItemType.WEAPON,
  ItemType.EQUIPABLE,
  ItemType.IDENTITY_DOCUMENT,
  ItemType.DRIVING_LICENSE,
  ItemType.WEAPON_LICENSE,
  ItemType.FISHING_LICENSE,
  ItemType.HUNTING_LICENSE,
  ItemType.SAILING_LICENSE
];

export const itemRegistry: Map<string, BaseItem> = new Map();

export abstract class BaseItem implements IBaseItem {
  description: string;
  model: string;
  name: string;
  type: ItemType[];
  weight: number;

  protected constructor(
    name: string, description: string,
    model: string, type: ItemType[], weight: number) {

    this.name = name;
    this.description = description;
    this.model = model;
    this.type = type;
    this.weight = weight;

    itemRegistry.set(this.name, this);
  }

  get isStackable() {
    return this.type.some(type =>
      NOT_STACKABLE_ITEM_TYPES.includes(type));
  }

  get isWeapon() {
    return this.type.includes(ItemType.WEAPON);
  }

  get isAmmo() {
    return this.type.includes(ItemType.AMMUNITION);
  }

  get isBankCard() {
    return this.type.includes(ItemType.BANK_CARD);
  }

  get isEquipable() {
    return this.type.includes(ItemType.EQUIPABLE);
  }
}
