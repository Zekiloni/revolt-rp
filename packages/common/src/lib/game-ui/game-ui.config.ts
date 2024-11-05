import { GameInterface } from './game-ui.model';
import { GameUiKey } from './game-ui-key.enum';

export const gameUiConfig: Record<GameUiKey, GameInterface> = {
  [GameUiKey.Authorization]: {
    isActive: false,
    freezeControls: true,
    mouse: true,
    disableChat: true,
  },

  [GameUiKey.CharacterCreator]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.Hud]: {
    isActive: false
  },

  [GameUiKey.VehicleHud]: {
    isActive: false
  },

  [GameUiKey.Inventory]: {
    isActive: true,
    mouse: true,
    freezeControls: true,
    disableChat: true
  }
};
