import { CharacterGender, getBestTorso } from '@revolt-rp/common';

const FEMALE_PED_MODEL = RageEnums.Ped.Hash.MP_F_FREEMODE_01;

export const applyBestTorso = () => {
  const drawableVariation = mp.players.local.getDrawableVariation(RageEnums.Clothes.TOPS);
  const textureVariation = mp.players.local.getTextureVariation(RageEnums.Clothes.TOPS);
  const gender = mp.players.local.model === FEMALE_PED_MODEL ? CharacterGender.FEMALE : CharacterGender.MALE;
  const torso = getBestTorso(gender, drawableVariation, textureVariation);
  if (torso) {
    mp.players.local.setComponentVariation(RageEnums.Clothes.TORSO, torso.bestTorsoDrawable, torso.bestTorsoTexture, 2);
  }
}
