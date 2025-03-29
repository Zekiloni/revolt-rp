import { ItemType } from './item-type';

export interface IBaseItem {
  name: string;
  description: string;
  type: ItemType[];
  weight: number;
  icon?: string;
  model: string;
}
