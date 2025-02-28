import { GameUiKey, IProperty, ProcedureKey } from '@revolt-rp/common';
import { on, triggerBrowser } from '@libertymp/rage-rpc';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';


let propertyInfo: IProperty | null = null;


function togglePropertyInfo(property: IProperty | null) {
  propertyInfo = property;

  if (propertyInfo) {
    showGameInterface(GameUiKey.PropertyInfo);
    setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_SET_PROPERTY_INFO, propertyInfo), 250);
  } else {
    hideGameInterface(GameUiKey.PropertyInfo);
  }
}

on(ProcedureKey.CLIENT_TOGGLE_PROPERTY_INFO, togglePropertyInfo);
