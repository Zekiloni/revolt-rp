import { ISelectableUsableItem, ItemType } from '@revolt-rp/common';
import { getRemoveClothing, setPlayerBestTorso } from './clothing.util';
import { BaseItem, Item } from '@revolt-rp/core';

export class WearableItem extends BaseItem implements ISelectableUsableItem<PlayerMp, Item> {
  componentId: RageEnums.ClothesComponent;
  wearableType = 'clothing';

  constructor(name: string, description: string, componentId: RageEnums.ClothesComponent, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.PRODUCT_CLOTHING_STORE, ItemType.EQUIPABLE, ItemType.CLOTHING, ...type], weight);
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
      this.unequip(player, item);
    }

    await item.save();
  }

  equip(player: PlayerMp, item: Item) {
    if (!item.wearableInfo)
      return;

    player.setClothes(this.componentId, item.wearableInfo.drawable, item.wearableInfo.texture, item.wearableInfo.palette);

    if (this.componentId === RageEnums.ClothesComponent.AUXILIARY)
      setPlayerBestTorso(player);
  }

  unequip(player: PlayerMp, _item: Item) {
    const removeClothing = getRemoveClothing(player.character.gender, this.componentId);
    if (removeClothing) {
      player.setClothes(this.componentId, removeClothing.drawable, removeClothing.texture, removeClothing.palette);

      if (this.componentId === RageEnums.ClothesComponent.AUXILIARY)
        setPlayerBestTorso(player);
    }
  }
}
