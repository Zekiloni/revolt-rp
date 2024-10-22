import { triggerBrowser } from '@libertymp/rage-rpc';
import { gameUiConfig, GameUiKey, ProcedureKey } from '@bcrp-rage/common';
import { environment } from '../environment/environment';

const CURSOR_TIMEOUT_MS = 500;

export const browser = mp.browsers.new(environment.BROWSER_URL);

mp.gui.chat.show(false);
browser.markAsChat();

function toggleCursor(freezeControls: boolean, mouse: boolean) {
  setTimeout(() => mp.gui.cursor.show(freezeControls, mouse), CURSOR_TIMEOUT_MS);
}

export function showGameInterface(interfaceKey: GameUiKey) {
  triggerBrowser(browser, ProcedureKey.BROWSER_SHOW_GAME_INTERFACE, interfaceKey);

  if (gameUiConfig[interfaceKey].mouse) {
    toggleCursor(gameUiConfig[interfaceKey].freezeControls ?? false, gameUiConfig[interfaceKey].mouse);
  }
}

export function hideGameInterface(interfaceKey: GameUiKey) {
  triggerBrowser(browser, ProcedureKey.BROWSER_HIDE_GAME_INTERFACE, interfaceKey);

  if (gameUiConfig[interfaceKey].mouse) {
    toggleCursor(false, false);
  }
}
