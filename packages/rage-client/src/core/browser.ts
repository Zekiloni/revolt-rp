import { triggerBrowser } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@bcrp-rage/common';

export const browser = mp.browsers.new('http://localhost:4200');

browser.markAsChat();

export function showInterface(interfaceKey: string) {
  triggerBrowser(browser, ProcedureKey.BROWSER_SHOW_GAME_INTERFACE, interfaceKey);
}

export function hideInterface(interfaceKey: string) {
  triggerBrowser(browser, ProcedureKey.BROWSER_HIDE_GAME_INTERFACE, interfaceKey);
}

