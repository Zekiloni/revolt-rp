import { BaseItem, Item } from '@revolt-rp/core';
import { IUsableItem, ItemFlag, ItemRarity, ItemType } from '@revolt-rp/common';

interface FoodItemConfig {
  requiresCooking?: boolean;
  cookingTime?: number;
  calories?: number;
  hydration?: number;
  alcohol?: number
  rarity?: ItemRarity;
}

export class FoodItem extends BaseItem implements IUsableItem<PlayerMp, Item> {
  calories?: number;
  hydration?: number;
  requiresCooking?: boolean;
  cookingTime?: number;
  alcohol?: number;
  rarity?: ItemRarity;

  constructor(name: string, description: string, type: ItemType[], model: string, weight: number, config: FoodItemConfig) {
    super(name, description, model, [ItemType.CONSUMABLE, ...type], weight);

    if (config.calories) {
      this.calories = config.calories;
    }

    if (config.hydration) {
      this.hydration = config.hydration;
    }
    if (config.requiresCooking) {
      this.requiresCooking = config.requiresCooking;
    }
    if (config.cookingTime) {
      this.cookingTime = config.cookingTime;
    }
    if (config.alcohol) {
      this.alcohol = config.alcohol;
    }

    if (config.rarity) {
      this.rarity = config.rarity;
    }
  }


  canUse(player: PlayerMp, item: Item): boolean {
    return !(this.requiresCooking && !this.isCooked(item));
  }

  select(player: PlayerMp, item: Item) {
    // No selection behavior for food items
  }

  use(player: PlayerMp, item: Item): Promise<void> | void {
    item.usage -= 20;

    if (this.calories) {
      player.character.hunger = Math.max(0, player.character.hunger - this.calories);
    }

    if (this.hydration) {
      player.character.thirst = Math.max(0, player.character.thirst - this.hydration);
    }
  }

  isCooked(item: Item): boolean {
    return item.flag != undefined && Array.isArray(item.flag) && item.flag.includes(ItemFlag.COOKED);
  }
}
