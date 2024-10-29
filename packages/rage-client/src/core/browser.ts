import { triggerBrowser } from '@libertymp/rage-rpc';
import { gameUiConfig, GameUiKey, ProcedureKey } from '@bcrp-rage/common';
import { environment } from '../environment/environment';

const CURSOR_TIMEOUT_MS = 150;

export const browser = mp.browsers.new(environment.BROWSER_URL);

mp.gui.chat.show(false);
browser.markAsChat();

const activeGameInterfaces: Set<string> = new Set();

function toggleCursor(freezeControls: boolean, mouse: boolean) {
  setTimeout(() => mp.gui.cursor.show(freezeControls, mouse), CURSOR_TIMEOUT_MS);
}

export function showGameInterface(interfaceKey: GameUiKey) {
  if (activeGameInterfaces.has(interfaceKey))
    return;

  triggerBrowser(browser, ProcedureKey.BROWSER_SHOW_GAME_INTERFACE, interfaceKey);

  const gameUiConfigElement = gameUiConfig[interfaceKey];

  if (gameUiConfigElement.mouse) {
    toggleCursor(gameUiConfigElement.freezeControls ?? false, gameUiConfigElement.mouse);
  }

  if (gameUiConfigElement.disableChat) {
    mp.gui.chat.activate(false);
    mp.console.logInfo('chat activate is false')
  }

  activeGameInterfaces.add(interfaceKey);
}

export function hideGameInterface(interfaceKey: GameUiKey) {
  if (!activeGameInterfaces.has(interfaceKey))
    return;

  triggerBrowser(browser, ProcedureKey.BROWSER_HIDE_GAME_INTERFACE, interfaceKey);

  const gameUiConfigElement = gameUiConfig[interfaceKey];

  if (gameUiConfigElement.mouse) {
    toggleCursor(false, false);
  }

  if (gameUiConfigElement.disableChat) {
    mp.gui.chat.activate(true);
  }
  activeGameInterfaces.delete(interfaceKey);
}
