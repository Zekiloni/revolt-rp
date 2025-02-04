import { CharacterGender } from '../../character/character.enums';
import { femaleBestTorso } from './female-best-torso';
import { maleBestTorso } from './male-best-torso';

export const getBestTorso = (gender: CharacterGender, drawable: number, texture: number) => {
  const data = gender === CharacterGender.FEMALE ? femaleBestTorso : maleBestTorso;
  const torso = data[drawable]?.[texture];

  if (!torso || torso.bestTorsoDrawable === -1) return null;

  return torso;
};
