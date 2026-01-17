import {
  on,
  triggerBrowser as rpcTriggerBrowser,
  callBrowser as rpcCallBrowser,
  CallOptions, triggerClient
} from '@libertymp/rage-rpc';
import {
  ActiveGameInterface,
  gameUiConfig,
  GameUiKey,
  HexKeyCodes,
  ProcedureKey
} from '@revolt-rp/common';
import { environment } from '../environment/environment';
import { registerKeyBind } from './keybind-manager';
import { disablePlayerControl, enablePlayerControl } from '../player/util/player-control.util';



const CURSOR_TIMEOUT_MS = 100;
const activeGameInterfaces: Set<GameUiKey> = new Set<GameUiKey>();

let isCursorActive = false;
let frozenControls = false;

const headlessBrowsers = new Map<GameUiKey, BrowserMp>();
export const browser = mp.browsers.new(environment.BROWSER_URL);


(() => {
  mp.gui.chat.show(false);
  browser.markAsChat();
})();

export function toggleCursor(freezeControls: boolean, mouse: boolean) {
  isCursorActive = mouse;
  frozenControls = freezeControls;
  setTimeout(() => mp.gui.cursor.show(freezeControls, mouse), CURSOR_TIMEOUT_MS);
}

function getActiveInterfaces(): ActiveGameInterface[] {
  const keys: GameUiKey[] = [];
  activeGameInterfaces.forEach((key) => {
    keys.push(key);
  });
  return keys.map(k => ({ key: k, ...gameUiConfig[k] }));
}

export const triggerBrowser = (procedureKey: ProcedureKey, args?: any) => {
  rpcTriggerBrowser(browser, procedureKey, args);
};

export const callBrowser = <T>(procedureKey: ProcedureKey, args?: any, options?: CallOptions) => {
  return rpcCallBrowser<T>(browser, procedureKey, args, options);
};

export const isMouseActive = () => isCursorActive;

export const isGameInterfaceActive = (interfaceKey: GameUiKey) => activeGameInterfaces.has(interfaceKey);

export function showGameInterface(interfaceKey: GameUiKey) {
  let newBrowser: BrowserMp | null = null;

  if (activeGameInterfaces.has(interfaceKey))
    return;

  const gameUiConfigElement = gameUiConfig[interfaceKey];

  if (!gameUiConfigElement)
    return;

  triggerBrowser(ProcedureKey.BROWSER_SHOW_GAME_INTERFACE, interfaceKey);

  if (gameUiConfigElement.headless) {
    newBrowser = mp.browsers.newHeadless(`${environment.BROWSER_URL}/headless/${interfaceKey}`, 1920, 1080, false);
    headlessBrowsers.set(interfaceKey, newBrowser);
  }

  if (gameUiConfigElement.mouse) {
    toggleCursor(gameUiConfigElement.freezeControls ?? false, gameUiConfigElement.mouse);
  }

  if (gameUiConfigElement.disableChat) {
    mp.gui.chat.activate(false);
  }

  if (gameUiConfigElement.hideChat) {
    mp.gui.chat.show(false);
  }

  if (gameUiConfigElement.closeOnEscape) {
    disablePlayerControl([RageEnums.Controls.INPUT_FRONTEND_PAUSE_ALTERNATE]);
  }

  activeGameInterfaces.add(interfaceKey);
  return newBrowser;
}

export function hideGameInterface(interfaceKey: GameUiKey) {
  if (!activeGameInterfaces.has(interfaceKey))
    return;

  triggerBrowser(ProcedureKey.BROWSER_HIDE_GAME_INTERFACE, interfaceKey);

  const gameUiConfigElement = gameUiConfig[interfaceKey];

  activeGameInterfaces.delete(interfaceKey);

  const remainingInterfaces = getActiveInterfaces();
  const anyMouse = remainingInterfaces.some(cfg => cfg.mouse);
  const anyFreeze = remainingInterfaces.some(cfg => cfg.freezeControls);

  if (gameUiConfigElement.mouse && !anyMouse) {
    toggleCursor(false, false);
  } else if (anyMouse) {
    toggleCursor(anyFreeze, true);
  }

  if (gameUiConfigElement.disableChat && !remainingInterfaces.some(cfg => cfg.disableChat)) {
    mp.gui.chat.activate(true);
  }

  if (gameUiConfigElement.hideChat && !remainingInterfaces.some(cfg => cfg.hideChat)) {
    mp.gui.chat.show(true);
  }

  if (gameUiConfigElement.closeOnEscape && !remainingInterfaces.some(cfg => cfg.closeOnEscape)) {
    enablePlayerControl([RageEnums.Controls.INPUT_FRONTEND_PAUSE_ALTERNATE]);
  }

  if (gameUiConfigElement.headless) {
    const headlessBrowser = headlessBrowsers.get(interfaceKey);
    if (headlessBrowser && mp.browsers.exists(headlessBrowser)) {
      headlessBrowser.destroy();
      headlessBrowsers.delete(interfaceKey);
    }
  }

  triggerClient(ProcedureKey.CLIENT_PLAYER_INTERFACE_CLOSED, interfaceKey);
}


function toggleGameInterfaceEscape() {
  const escapeCloseInterfaces = getActiveInterfaces().filter(cfg => cfg.closeOnEscape);
  if (escapeCloseInterfaces.length) {
    const lastOpenedInterface = escapeCloseInterfaces.pop();
    if (lastOpenedInterface) {
      hideGameInterface(lastOpenedInterface.key);
    }
  }
}

function handleForceToggleCursor() {
  isCursorActive = !isCursorActive;
  toggleCursor(frozenControls, isCursorActive);
}

registerKeyBind(HexKeyCodes.F3, true, handleForceToggleCursor);
registerKeyBind(HexKeyCodes.Escape, true, toggleGameInterfaceEscape);

on(ProcedureKey.CLIENT_PLAYER_SHOW_INTERFACE, showGameInterface);
on(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, hideGameInterface);
