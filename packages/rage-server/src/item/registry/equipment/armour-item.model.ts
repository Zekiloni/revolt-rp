import { WearableItem } from '../clothing/wearable-item.model';
import { ItemType } from '@revolt-rp/common';
import { Item } from '@revolt-rp/core';

export class ArmourItem extends WearableItem {
  armourAmount: number;

  constructor(name: string, description: string, model: string, armorAmount: number, weight: number) {
    super(name, description, RageEnums.ClothesComponent.BODY_ARMORS, model, [ItemType.EQUIPABLE, ItemType.CLOTHING, ItemType.ARMOUR], weight);
    this.armourAmount = armorAmount;
  }

  equip(player: PlayerMp, item: Item) {
    super.equip(player, item);
    if (item.usage !== undefined) {
      const effectiveArmor = Math.floor((item.usage / 100) * this.armourAmount);
      player.armour = Math.min(100, effectiveArmor);
    } else {
      player.armour = this.armourAmount;
    }
  }

  unequip(player: PlayerMp, item: Item) {
    item.usage = (player.armour / this.armourAmount) * 100;
    player.armour = 0;

    super.unequip(player, item);
  }
}
