import { GameInterface } from './game-ui.model';
import { GameUiKey } from './game-ui-key.enum';

export const gameUiConfig: Record<GameUiKey, GameInterface> = {
  playerAuthorization: {
    isActive: true
  },

  characterSelector: {
    isActive: false
  },

  playerInventory: {
    isActive: false
  }
};
