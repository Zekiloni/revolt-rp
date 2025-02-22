import { on, triggerBrowser } from '@libertymp/rage-rpc';
import { gameUiConfig, GameUiKey, HexKeyCodes, ProcedureKey } from '@revolt-rp/common';
import { environment } from '../environment/environment';
import { registerKeyBind } from './keybind-manager';


const CURSOR_TIMEOUT_MS = 100;
const activeGameInterfaces: Set<GameUiKey> = new Set();

let isCursorActive = false;
let frozenControls = false;

export const browser = mp.browsers.new(environment.BROWSER_URL);

(() => {
  mp.gui.chat.show(false);
  browser.markAsChat();
})();

function toggleCursor(freezeControls: boolean, mouse: boolean) {
  isCursorActive = mouse;
  frozenControls = freezeControls;
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

function handleForceToggleCursor() {
  isCursorActive = !isCursorActive;
  toggleCursor(frozenControls, isCursorActive);
}


registerKeyBind(HexKeyCodes.F3, true, handleForceToggleCursor);
on(ProcedureKey.CLIENT_PLAYER_SHOW_INTERFACE, showGameInterface);
on(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, hideGameInterface);
