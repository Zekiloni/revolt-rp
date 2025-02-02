import { ItemType } from '@revolt-rp/common';
import { BaseItem } from '../base-item.model';
import { Item } from '../../item.model';
import { getRemoveClothing } from './clothing.util';

export class WearableItem extends BaseItem {
  componentId: number;

  constructor(name: string, description: string, componentId: number, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.WEAPON, ...type], weight);
    this.componentId = componentId;
  }

  select(player: PlayerMp, item: Item): void {
    // todo?
  }

  async use(player: PlayerMp, item: Item) {
    if (!item.wearableInfo)
      return;

    item.equipped = !item.equipped;

    if (item.equipped) {
      this.equip(player, item);
    } else {
      this.unequip(player);
    }

    await item.save();
  }

  equip(player: PlayerMp, item: Item) {
    if (!item.wearableInfo)
      return;

    player.setClothes(this.componentId, item.wearableInfo.drawable, item.wearableInfo.texture, item.wearableInfo.palette);
  }

  unequip(player: PlayerMp) {
    const removeClothing = getRemoveClothing(player.character.gender, this.componentId);
    if (removeClothing) {
      player.setClothes(this.componentId, removeClothing.drawable, removeClothing.texture, removeClothing.palette);
    }
  }
}
