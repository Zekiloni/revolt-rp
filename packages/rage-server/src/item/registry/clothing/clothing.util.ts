import { CharacterGender, IWearableInfo } from '@revolt-rp/common';
import { NO_CLOTHING } from './clothing.config';


export const getRemoveClothing = (gender: CharacterGender, componentId: number) => {
  if (NO_CLOTHING[gender] && NO_CLOTHING[gender][componentId]) {
    return NO_CLOTHING[gender][componentId] as IWearableInfo;
  } else {
    return null;
  }
};
