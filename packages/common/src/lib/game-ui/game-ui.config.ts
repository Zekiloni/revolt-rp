import { GameInterface } from './game-ui.model';
import { GameUiKey } from './game-ui-key.enum';

export const gameUiConfig: Record<GameUiKey, GameInterface> = {
  [GameUiKey.Authorization]: {
    isActive: false,
    freezeControls: true,
    mouse: true
  },

  [GameUiKey.CharacterCreator]: {
    isActive: false,
    mouse: true,
    freezeControls: true
  },

  [GameUiKey.Inventory]: {
    isActive: false,
    mouse: true,
    disableChat: true
  }
};
