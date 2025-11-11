import {
  on,
  triggerBrowser as rpcTriggerBrowser,
  callBrowser as rpcCallBrowser,
  CallOptions
} from '@libertymp/rage-rpc';
import { gameUiConfig, GameUiKey, HexKeyCodes, ProcedureKey } from '@revolt-rp/common';
import { environment } from '../environment/environment';
import { registerKeyBind } from './keybind-manager';
import { disablePlayerControl, enablePlayerControl } from '../player/util/player-control.util';


const CURSOR_TIMEOUT_MS = 100;
const activeGameInterfaces: Set<GameUiKey> = new Set();
const escapeCloseInterfaces: Set<GameUiKey> = new Set();

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

function getRemainingInterfaces() {
  const keys: GameUiKey[] = [];
  activeGameInterfaces.forEach((key) => {
    keys.push(key);
  });
  return keys.map(k => gameUiConfig[k]);
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
  if (activeGameInterfaces.has(interfaceKey))
    return;

  triggerBrowser(ProcedureKey.BROWSER_SHOW_GAME_INTERFACE, interfaceKey);

  const gameUiConfigElement = gameUiConfig[interfaceKey];

  if (gameUiConfigElement.mouse) {
    toggleCursor(gameUiConfigElement.freezeControls ?? false, gameUiConfigElement.mouse);
  }

  if (gameUiConfigElement.disableChat) {
    mp.gui.chat.activate(false);
  }

  if (gameUiConfigElement.closeOnEscape) {
    escapeCloseInterfaces.add(interfaceKey);
  }

  if (activeGameInterfaces.size > 0) {
    disablePlayerControl([RageEnums.Controls.INPUT_FRONTEND_PAUSE_ALTERNATE]);
  }

  activeGameInterfaces.add(interfaceKey);
}

export function hideGameInterface(interfaceKey: GameUiKey) {
  if (!activeGameInterfaces.has(interfaceKey))
    return;

  triggerBrowser(ProcedureKey.BROWSER_HIDE_GAME_INTERFACE, interfaceKey);

  const gameUiConfigElement = gameUiConfig[interfaceKey];

  activeGameInterfaces.delete(interfaceKey);

  const remainingInterfaces = getRemainingInterfaces();
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

  if (gameUiConfigElement.closeOnEscape) {
    mp.gui.chat.push(`Closed ${interfaceKey}, closeOnEscape deleted`);
    escapeCloseInterfaces.delete(interfaceKey);
  }

  if (activeGameInterfaces.size == 0) {
    mp.gui.chat.push(`Enabling player controls after closing ${interfaceKey}`);
    enablePlayerControl([RageEnums.Controls.INPUT_FRONTEND_PAUSE_ALTERNATE]);
  }

  // TODO: Announce interface closed event

}

function handleGameInterfaceRender() {
  if (escapeCloseInterfaces.size) {
    if (mp.game.controls.isControlJustPressed(RageEnums.InputGroup.MAX_INPUTGROUPS, RageEnums.Controls.INPUT_FRONTEND_PAUSE_ALTERNATE)) {
      mp.gui.chat.push('ESC pressed, closing last escapeCloseInterface');
      const lastInterfaceKey = Array.from(escapeCloseInterfaces).pop();
      mp.gui.chat.push(`Last interface key: ${lastInterfaceKey}`);
      if (lastInterfaceKey) {
        hideGameInterface(lastInterfaceKey);
      }
    }
  }
}

function handleForceToggleCursor() {
  isCursorActive = !isCursorActive;
  toggleCursor(frozenControls, isCursorActive);
}

registerKeyBind(HexKeyCodes.F3, true, handleForceToggleCursor);

on(ProcedureKey.CLIENT_PLAYER_SHOW_INTERFACE, showGameInterface);
on(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, hideGameInterface);
mp.events.add('render', handleGameInterfaceRender);
