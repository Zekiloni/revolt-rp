import { WearableItem } from '../clothing/wearable-item.model';
import { ItemType } from '@revolt-rp/common';
import { Item } from '../../item.model';

export class ArmourItem extends WearableItem {
  armourAmount: number;

  constructor(name: string, description: string, model: string, armorAmount: number, weight: number) {
    super(name, description, RageEnums.ClothesComponent.ACCESSORIES_2, model, [ItemType.EQUIPABLE, ItemType.CLOTHING, ItemType.ARMOUR], weight);
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

  unequip(player: PlayerMp) {
    super.unequip(player);
    player.armour = 0;
  }
}
