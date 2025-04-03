import { Item } from '../../item/item.model';
import { WearableItem } from '../../item/registry/clothing/wearable-item.model';
import { getRemoveClothing, setPlayerBestTorso } from '../../item/registry/clothing/clothing.util';


const CLOTHES = [
  RageEnums.ClothesComponent.MASK,
  RageEnums.ClothesComponent.LEGS,
  RageEnums.ClothesComponent.HANDS,
  RageEnums.ClothesComponent.SHOES,
  RageEnums.ClothesComponent.AUXILIARY,
  RageEnums.ClothesComponent.ACCESSORIES_1,
  RageEnums.ClothesComponent.DECALS,
  RageEnums.ClothesComponent.ACCESSORIES_2
];

export const loadPlayerClothing = (player: PlayerMp) => {
  const equippedClothes = player.character.inventory.filter(
    (item: Item) => item.data && item.data.isEquipable && item.equipped
  );

  const setComponents: Set<RageEnums.ClothesComponent> = new Set();

  equippedClothes.forEach((item: Item) => {
      const wearableITem = item.data as WearableItem;
      wearableITem.equip(player, item);
      setComponents.add(wearableITem.componentId);
    }
  );

  CLOTHES.forEach((componentId) => {
    if (!setComponents.has(componentId)) {
      const removeClothing = getRemoveClothing(player.character.gender, componentId);
      if (removeClothing) {
        player.setClothes(componentId, removeClothing.drawable, removeClothing.texture, removeClothing.palette);
      }
    }
  });

  setPlayerBestTorso(player);
};


