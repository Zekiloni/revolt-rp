import { gameUiConfig, GameUiKey, HexKeyCodes, ProcedureKey } from '@revolt-rp/common';
import { hideGameInterface, showGameInterface } from '../core/browser';
import { registerKeyBind } from '../core/keybind-manager';
import { on } from '@libertymp/rage-rpc';
import { getIsSpawned } from './util/player-data.util';


let isMenuActive = gameUiConfig.playerMenu.isActive;

function togglePlayerMenu() {
  isMenuActive = !isMenuActive;

  if (isMenuActive) {
    showGameInterface(GameUiKey.PlayerMenu);
  } else {
    hideGameInterface(GameUiKey.PlayerMenu);
  }
}

registerKeyBind(HexKeyCodes.Home, true, togglePlayerMenu, 0, [getIsSpawned]);
on(ProcedureKey.CLIENT_TOGGLE_PLAYER_MENU, togglePlayerMenu);
