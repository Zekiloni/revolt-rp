import { IWearableInfo } from '../../../item/wearable-info.model';
import { CharacterGender } from '../../character/character.enums';

export interface IDefaultOutfit extends IWearableInfo {
  componentId: number;
}

export const defaultOutfits: Record<CharacterGender, IDefaultOutfit[][]> = {
  [CharacterGender.MALE]: [
    // Outfit 1
    [
      { componentId: 11, drawable: 86, texture: 0, palette: 2 },
      { componentId: 4, drawable: 0, texture: 0, palette: 2 },
      { componentId: 6, drawable: 1, texture: 0, palette: 2 },
      { componentId: 8, drawable: 15, texture: 0, palette: 2 },
    ],
    // Outfit 2
    [
      { componentId: 11, drawable: 61, texture: 0, palette: 2 },
      { componentId: 4, drawable: 4, texture: 0, palette: 2 },
      { componentId: 6, drawable: 1, texture: 0, palette: 2 },
      { componentId: 8, drawable: 15, texture: 0, palette: 2 },
    ],
    // Outfit 3
    [
      { componentId: 11, drawable: 57, texture: 0, palette: 2 },
      { componentId: 4, drawable: 4, texture: 4, palette: 2 },
      { componentId: 6, drawable: 1, texture: 0, palette: 2 },
      { componentId: 8, drawable: 15, texture: 0, palette: 2 },
    ],
    // Outfit 4
    [
      { componentId: 11, drawable: 182, texture: 0, palette: 2 },
      { componentId: 4, drawable: 79, texture: 0, palette: 2 },
      { componentId: 6, drawable: 1, texture: 1, palette: 2 },
      { componentId: 8, drawable: 15, texture: 0, palette: 2 },
    ],
    // Outfit 5
    [
      { componentId: 11, drawable: 93, texture: 0, palette: 2 },
      { componentId: 4, drawable: 24, texture: 0, palette: 2 },
      { componentId: 6, drawable: 21, texture: 0, palette: 2 },
      { componentId: 8, drawable: 15, texture: 0, palette: 2 },
    ]
  ],
  [CharacterGender.FEMALE]: [
    // Outfit 1
    [
      { componentId: 11, drawable: 10, texture: 0, palette: 2 },
      { componentId: 4, drawable: 11, texture: 1, palette: 2 },
      { componentId: 6, drawable: 10, texture: 0, palette: 2 },
      { componentId: 8, drawable: 15, texture: 0, palette: 2 },
    ],
    // Outfit 2
    [
      { componentId: 11, drawable: 79, texture: 0, palette: 2 },
      { componentId: 4, drawable: 0, texture: 0, palette: 2 },
      { componentId: 6, drawable: 10, texture: 1, palette: 2 },
      { componentId: 8, drawable: 15, texture: 0, palette: 2 },
    ],
    // Outfit 3
    [
      { componentId: 11, drawable: 103, texture: 0, palette: 2 },
      { componentId: 4, drawable: 6, texture: 0, palette: 2 },
      { componentId: 6, drawable: 27, texture: 0, palette: 2 },
      { componentId: 8, drawable: 15, texture: 0, palette: 2 },
    ],
    // Outfit 4
    [
      { componentId: 11, drawable: 262, texture: 0, palette: 2 },
      { componentId: 4, drawable: 75, texture: 0, palette: 2 },
      { componentId: 6, drawable: 27, texture: 0, palette: 2 },
      { componentId: 8, drawable: 15, texture: 0, palette: 2 },
    ]
  ]
};
