import { BaseItem, Item } from '@revolt-rp/core';
import { AddictionType, ItemType, IUsableItem } from '@revolt-rp/common';
import { drugHandlers } from '../../player/player-drug.service';


export class DrugItem extends BaseItem implements IUsableItem<PlayerMp, Item> {
  addiction: AddictionType;

  constructor(name: string, description: string, addiction: AddictionType, model: string, weight: number) {
    super(name, description, model, [ItemType.CONSUMABLE, ItemType.DRUG], weight);
    this.addiction = addiction;
  }

  use(player: PlayerMp, item: Item): Promise<void> | void {
    if (this.addiction in drugHandlers) {
      return drugHandlers[this.addiction](player, item);
    }
  }
}
