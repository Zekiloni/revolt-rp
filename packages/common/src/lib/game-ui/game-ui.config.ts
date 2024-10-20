import { GameInterface } from './game-ui.model';
import { GameUiKey } from './game-ui-key.enum';

export const gameUiConfig: Record<GameUiKey, GameInterface> = {
  [GameUiKey.Authorization]: {
    isActive: false,
    freezeControls: true,
    mouse: true
  },

  [GameUiKey.CharacterSelector]: {
    isActive: false,
    mouse: true,
    freezeControls: true
  },

  [GameUiKey.CharacterCreator]: {
    isActive: false
  },

  [GameUiKey.Inventory]: {
    isActive: false
  }
};
