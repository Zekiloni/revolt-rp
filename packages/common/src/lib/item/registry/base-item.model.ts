import { ItemType } from './item-type';

export interface IBaseItem {
  name: string;
  description: string;
  type: ItemType[];
  weight: number;
  icon?: string;
  model: string;

  isStackable: boolean;

  isWeapon: boolean;
  isEquipable: boolean;
  isBankCard: boolean;
  isAmmo: boolean;

  [method: string]: ((...args: any[]) => any) | any;
}
