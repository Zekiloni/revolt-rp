import { BaseItem, Item } from '@revolt-rp/core';
import { IUsableItem, ItemType } from '@revolt-rp/common';

export class LicenseItem extends BaseItem implements IUsableItem<PlayerMp, Item> {

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
