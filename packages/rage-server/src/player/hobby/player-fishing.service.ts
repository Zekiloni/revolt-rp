import { IFishReward, IFishType, ItemFlag, ItemRarity, ItemType } from '@revolt-rp/common';
import { filterItemsByType, getBaseItem } from '@revolt-rp/core';
import { FoodItem } from '../../item/registry/food.item.model';
import { playerGiveItem } from '../inventory/player-inventory.service';


const playerFishReward: Map<number, IFishReward> = new Map();

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

export const playerCatchFish = (player: PlayerMp): IFishReward => {
  const roll = Math.random() * totalChance;
  let accumulated = 0;

  for (const fishType of fishTypes) {
    accumulated += fishType.chance;

    if (roll <= accumulated) {
      const [minWeight, maxWeight] = fishType.weightRange;
      const weight = parseFloat(
        (minWeight + Math.random() * (maxWeight - minWeight)).toFixed(2)
      );

      const fishReward: IFishReward = { type: fishType, weight };
      playerFishReward.set(player.id, fishReward);

      return fishReward;
    }
  }

  const fallback = fishTypes[0];
  const reward = {
    type: fallback,
    weight: parseFloat(fallback.weightRange[0].toFixed(2))
  };

  playerFishReward.set(player.id, reward);
  return reward;
};

const playerTakeFish = async (player: PlayerMp) => {
  const fishReward = playerFishReward.get(player.id);
  if (!fishReward) {
    return;
  }

  const fishBaseItem = getBaseItem<FoodItem>(fishReward.type.name);

  if (!fishBaseItem) {
    return;
  }

  playerFishReward.delete(player.id);
  const flag = fishBaseItem.rarity == 'COMMON' ? undefined : fishBaseItem.rarity;
  await playerGiveItem(player, fishReward.type.name, 1, { flag });
};

const playerReleaseFish = (player: PlayerMp) => {
  playerFishReward.delete(player.id);
}


export const playerFishResponse = async (player: PlayerMp, take: boolean) => {
  if (take) {
    await playerTakeFish(player);
  } else {
    playerReleaseFish(player);
  }
}

