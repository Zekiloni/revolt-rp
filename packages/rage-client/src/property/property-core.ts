import { callServer, on, triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import { GameUiKey, HexKeyCodes, IProperty, ProcedureKey } from '@revolt-rp/common';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';
import { registerKeyBind, unregisterKeyBind } from '../core/keybind-manager';


let propertyInfo: IProperty | null = null;


function propertyMainInteraction() {
  if (propertyInfo) {
    triggerServer(ProcedureKey.SERVER_PROPERTY_MAIN_INTERACTION, propertyInfo.id);
  }
}

function togglePropertyInfo(property: IProperty | null) {
  propertyInfo = property;

  if (propertyInfo) {
    showGameInterface(GameUiKey.PropertyInfo);
    setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_SET_PROPERTY_INFO, propertyInfo), 250);
    registerKeyBind(HexKeyCodes.L, false, lockProperty, 0);
    registerKeyBind(HexKeyCodes.Y, false, propertyMainInteraction, 0);
  } else {
    hideGameInterface(GameUiKey.PropertyInfo);
    unregisterKeyBind(HexKeyCodes.L, lockProperty);
    unregisterKeyBind(HexKeyCodes.Y, propertyMainInteraction);
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
