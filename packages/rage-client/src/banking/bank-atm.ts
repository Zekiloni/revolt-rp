import { on, triggerBrowser } from '@libertymp/rage-rpc';
import { GameUiKey, IItem, ProcedureKey } from '@revolt-rp/common';
import { getIsAlive, getIsCuffed } from '../player/util/player-data.util';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';
import { toggleClickToUseItem } from '../player/player-item';


const ATM_OBJECT_MODELS = [
  mp.game.joaat('prop_atm_01'),
  mp.game.joaat('prop_atm_02'),
  mp.game.joaat('prop_atm_03'),
  mp.game.joaat('prop_fleeca_atm')
];

const ATM_USE_RADIUS = 1.5;

let isAtmActive = false;

const isNearAtm = (position: Vector3) => {
  const { x, y, z } = position;
  return ATM_OBJECT_MODELS.some(model =>
    mp.game.object.getClosestObjectOfType(x, y, z, ATM_USE_RADIUS, model, false, true, true) !== 0
  );
};


function toggleAtm(toggle: boolean, bankCardItem?: IItem) {
  if (toggle && bankCardItem) {
    if (isAtmActive) return;

    isAtmActive = true;
    showGameInterface(GameUiKey.ATM);
    setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_ATM_INIT, bankCardItem), 250);

    toggleClickToUseItem(false);
  } else {

    isAtmActive = false;
    hideGameInterface(GameUiKey.ATM);
    toggleClickToUseItem(true);
  }
}

function closeAtmHandler() {
  toggleAtm(false, undefined);
}

function bankCardUseHandler(item: IItem) {
  if (getIsCuffed() || !getIsAlive())
    return;

  if (isNearAtm(mp.players.local.position)) {
    toggleAtm(true, item);
  }
}

on(ProcedureKey.CLIENT_PLAYER_USE_BANK_CARD, bankCardUseHandler);
on(ProcedureKey.CLIENT_PLAYER_CLOSE_ATM, closeAtmHandler);
