import { CharacterGender, getBestTorso, IWearableInfo } from '@revolt-rp/common';
import { itemRegistry } from '@revolt-rp/core';
import { NO_CLOTHING } from './clothing.config';
import { WearableItem } from './wearable-item.model';


export const getWearableItemByComponent = (componentId: RageEnums.ClothesComponent) => {
  return [...itemRegistry.values()].filter(item => item.isEquipable)
    .find((item: WearableItem) => item.componentId === componentId);
};

export const getRemoveClothing = (gender: CharacterGender, componentId: number) => {
  if (NO_CLOTHING[gender] && NO_CLOTHING[gender][componentId]) {
    return NO_CLOTHING[gender][componentId] as IWearableInfo;
  } else {
    return null;
  }
};

export const setPlayerBestTorso = (player: PlayerMp) => {
  const top = player.getClothes(RageEnums.ClothesComponent.DECALS);
  const torso = getBestTorso(player.character.gender, top.drawable, top.texture);
  if (torso) {
    player.setClothes(RageEnums.ClothesComponent.TORSO, torso.bestTorsoDrawable, torso.bestTorsoTexture, 2);
  }
};
