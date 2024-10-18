import { GameInterface } from './game-ui.model';
import { GameUiKey } from './game-ui-key.enum';

export const gameUiConfig: Record<GameUiKey, GameInterface> = {
  [GameUiKey.Authorization]: {
    isActive: true
  },

  [GameUiKey.CharacterSelector]: {
    isActive: false
  },

  [GameUiKey.CharacterCreator]: {
    isActive: true
  },

  [GameUiKey.Inventory]: {
    isActive: false
  }
};
