import { IGameInterface } from './game-ui.model';
import { GameUiKey } from './game-ui-key.enum';

export const gameUiConfig: Record<GameUiKey, IGameInterface> = {
  [GameUiKey.Authorization]: {
    isActive: false,
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

  [GameUiKey.HelpMenu]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.Offer]: {
    isActive: false
  },

  [GameUiKey.VehicleHud]: {
    isActive: false
  },

  [GameUiKey.PlayerMenu]: {
    isActive: false,
    freezeControls: true,
    mouse: true,
    disableChat: true,
    closeOnEscape: true
  },

  [GameUiKey.Inventory]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true,
    closeOnEscape: true
  },

  [GameUiKey.BankMenu]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.ATM]: {
    isActive: false,
    mouse: true,
    disableChat: true,
    freezeControls: true
  },

  [GameUiKey.AnimationMenu]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.DeathScreen]: {
    isActive: false
  },

  [GameUiKey.DamageInfo]: {
    isActive: false,
    mouse: true,
    disableChat: true,
    freezeControls: true
  },

  [GameUiKey.CreateOrganization]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.ManageOrganization]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.HandheldRadio]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.BanInfo]: {
    isActive: false,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.CreateProperty]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.PropertyInfo]: {
    isActive: false
  },

  [GameUiKey.ManageProperty]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.Smartphone]: {
    isActive: false,
    mouse: true,
    disableChat: true,
  },

  [GameUiKey.DmvMenu]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.ManageVehicle]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.Trunk]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true,
    closeOnEscape: true
  },

  [GameUiKey.RentCatalog]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.VehicleMenu]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.GroceryStore]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.ClothingStore]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.VehicleDealership]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
  },

  [GameUiKey.JobMenu]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.GrafitiCreator]: {
    isActive: false,
    mouse: true,
    freezeControls: true,
    disableChat: true
  },

  [GameUiKey.MDC]: {
    isActive: true,
    mouse: true,
    freezeControls: true,
  },

  [GameUiKey.PlateRecognition]: {
    isActive: false,
  },

  [GameUiKey.HeliCam]: {
    isActive: false
  },

  [GameUiKey.GarageMenu]: {
    isActive: false,
    mouse: true,
  },

  [GameUiKey.FishingMinigame]: {
    isActive: false,
    closeOnEscape: true,
  },

  [GameUiKey.EquipmentMenu]: {
    isActive: false,
    mouse: true,
    closeOnEscape: true,
    freezeControls: true
  }
};
