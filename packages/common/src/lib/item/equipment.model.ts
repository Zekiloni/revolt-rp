import { IItem } from './item.model';
import { IBaseItem } from './registry/base-item.model';

export interface IEquipment {
  item: string;
  quantity?: number;
  limit: number;
  data: IBaseItem;
  price?: number;
  options?: Partial<IItem>;
}
