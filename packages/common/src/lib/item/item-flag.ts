
export type ItemRarity = ItemFlag.UNCOMMON | ItemFlag.RARE | ItemFlag.EPIC | 'COMMON';

export enum ItemFlag {
  IMPORTANT= 'important',

  /* Food flags */
  COOKED= 'cooked',

  /* Drink Flags */
  EMPTY_BOTTLE = 'empty_bottle',

  /* Rarity */
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic'
}

