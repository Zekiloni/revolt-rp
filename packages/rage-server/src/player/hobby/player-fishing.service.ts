import { IFishReward, IFishType, ItemFlag, ItemRarity, ItemType } from '@revolt-rp/common';
import { filterItemsByType } from '@revolt-rp/core';
import { FoodItem } from '../../item/registry/food.item.model';


const RARITY_CHANCE_MAP: Record<ItemRarity, number> = {
  COMMON: 60,
  [ItemFlag.UNCOMMON]: 25,
  [ItemFlag.RARE]: 12,
  [ItemFlag.EPIC]: 3
};

const fishTypes: IFishType[] = filterItemsByType(ItemType.FISH).map((fishItem: FoodItem) => ({
  name: fishItem.name,
  description: fishItem.description,
  weightRange: [fishItem.weight * 0.8, fishItem.weight * 1.2],
  chance: RARITY_CHANCE_MAP[fishItem.rarity] / 100
}));

const totalChance = fishTypes.reduce((sum, fish) => sum + fish.chance, 0);


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const playerCatchFish = (_player: PlayerMp): IFishReward => {
  const roll = Math.random() * totalChance;
  let accumulated = 0;

  for (const fishType of fishTypes) {
    accumulated += fishType.chance;

    if (roll <= accumulated) {
      const [minWeight, maxWeight] = fishType.weightRange;
      const weight = parseFloat(
        (minWeight + Math.random() * (maxWeight - minWeight)).toFixed(2)
      );

      return {
        type: fishType,
        weight
      };
    }
  }

  const fallback = fishTypes[0];
  return {
    type: fallback,
    weight: parseFloat(fallback.weightRange[0].toFixed(2))
  };
};
