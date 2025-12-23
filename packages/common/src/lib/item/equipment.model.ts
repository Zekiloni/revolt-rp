import { IItem } from './item.model';

export interface IEquipment {
  item: string;
  quantity?: number;
  limit: number;
  price?: number;
  options?: Partial<IItem>;
}
