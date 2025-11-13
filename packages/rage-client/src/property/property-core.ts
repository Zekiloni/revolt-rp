import { callServer, on, triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import { GameUiKey, HexKeyCodes, IProperty, ProcedureKey } from '@revolt-rp/common';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';
import { registerKeyBind, unregisterKeyBind } from '../core/keybind-manager';
import { getDistance } from '../util/vector.util';


let propertyInfo: IProperty | null = null;
let checkCheckpointInterval: NodeJS.Timer | null = null;
const MAX_DISTANCE = 5;

function propertyMainInteraction() {
  if (propertyInfo) {
    triggerServer(ProcedureKey.SERVER_PROPERTY_MAIN_INTERACTION, propertyInfo.id);
  }
}


function togglePropertyInfo(property: IProperty | null) {
  propertyInfo = property;

  const initialPosition = mp.players.local.position;
  if (propertyInfo) {
    showGameInterface(GameUiKey.PropertyInfo);
    setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_SET_PROPERTY_INFO, propertyInfo), 250);
    registerKeyBind(HexKeyCodes.L, false, lockProperty, 0);
    registerKeyBind(HexKeyCodes.Y, false, propertyMainInteraction, 0);

    checkCheckpointInterval = setInterval(() => {

      const currentPosition = mp.players.local.position;
      const distance = getDistance(initialPosition, currentPosition);

      if (distance > MAX_DISTANCE) {
        mp.gui.chat.push('~r~You have moved too far from the property. Closing property info.' + distance);
        togglePropertyInfo(null);
      }
    }, 1000);
  } else {
    hideGameInterface(GameUiKey.PropertyInfo);
    unregisterKeyBind(HexKeyCodes.L, lockProperty);
    unregisterKeyBind(HexKeyCodes.Y, propertyMainInteraction);
    if (checkCheckpointInterval) {
      clearInterval(checkCheckpointInterval);
      checkCheckpointInterval = null;
    }
  }
}


function togglePropertyMenu(property: IProperty | null) {
  if (property) {
    togglePropertyInfo(null);
    showGameInterface(GameUiKey.ManageProperty);
    setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_SET_PROPERTY, property), 250);
  } else {
    hideGameInterface(GameUiKey.ManageProperty);
  }
}

async function lockProperty() {
  if (propertyInfo && propertyInfo.id) {
    await callServer(ProcedureKey.SERVER_PROPERTY_LOCK, propertyInfo.id);
  }
}

on(ProcedureKey.CLIENT_TOGGLE_PROPERTY_INFO, togglePropertyInfo);
on(ProcedureKey.CLIENT_TOGGLE_PROPERTY_MENU, togglePropertyMenu);
