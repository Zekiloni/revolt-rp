import { BaseItem } from './base-item.model';
import { Item } from '@revolt-rp/core';
import { ItemType } from '@revolt-rp/common';

export class UtilityItem extends BaseItem {

  constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.MISCELLANEOUS, ...type], weight);
  }

  select(player: PlayerMp, item: Item): void {

  }

  deselect(player: PlayerMp, item: Item) {
    super.deselect(player, item);
  }

  use(player: PlayerMp, item: Item): void {
  }
}
