import { BaseItem } from '@revolt-rp/core';
import { ItemType } from '@revolt-rp/common';


export class MiscellaneousItem extends BaseItem {

  constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.MISCELLANEOUS, ...type], weight);
  }
}
