import { BaseItem, Item } from '@revolt-rp/core';
import { ISelectableItem, ItemType } from '@revolt-rp/common';
import { playerDeployItem } from '../../../player/inventory/player-inventory.service';

export class SpeakerItemModel extends BaseItem implements ISelectableItem<PlayerMp, Item> {
  constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.DEVICE_SPEAKER, ...type], weight);
  }

  async select(player: PlayerMp, item: Item) {
    await playerDeployItem(player, item);
  }
}
