import { GameInterface } from './game-ui.model';
import { GameUiKey } from './game-ui-key.enum';

export const gameUiConfig: Record<GameUiKey, GameInterface> = {
  [GameUiKey.Authorization]: {
    isActive: true,
    freezeControls: true,
    mouse: true,
    disableChat: true
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

  [GameUiKey.PlayerMenu]: {
    isActive: false
  },

  [GameUiKey.Inventory]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  }
};
