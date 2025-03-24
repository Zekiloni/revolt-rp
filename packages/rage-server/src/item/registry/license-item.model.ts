import { BaseItem } from './base-item.model';
import { ItemType } from '@revolt-rp/common';
import { Item } from '../item.model';

export class LicenseItem extends BaseItem {

  constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [...type], weight);
  }

  select(player: PlayerMp, item: Item): void {
    //  todo
  }

  use(player: PlayerMp, item: Item): void {
    //  todo
  }
}
