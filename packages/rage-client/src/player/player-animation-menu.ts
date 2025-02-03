import { on } from '@libertymp/rage-rpc';
import { gameUiConfig, GameUiKey, HexKeyCodes, ProcedureKey } from '@revolt-rp/common';
import { hideGameInterface, showGameInterface } from '../core/browser';
import { registerKeyBind } from '../core/keybind-manager';
import { getIsAlive, getIsNotCuffed, getIsSpawned } from './util/player-data.util';


let animationMenuActive = gameUiConfig.animationMenu.isActive;

function toggleAnimationMenu(toggle?: boolean) {
  animationMenuActive = toggle !== undefined ? toggle : !animationMenuActive;
  if (animationMenuActive) {
    showGameInterface(GameUiKey.AnimationMenu);
  } else {
    hideGameInterface(GameUiKey.AnimationMenu);
  }
}

on(ProcedureKey.CLIENT_TOGGLE_ANIMATION_MENU, toggleAnimationMenu);
registerKeyBind(HexKeyCodes.M, true, toggleAnimationMenu, 0, [getIsSpawned, getIsAlive, getIsNotCuffed]);
