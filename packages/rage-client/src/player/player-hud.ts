import { triggerBrowser } from '@libertymp/rage-rpc';
import { gameUiConfig, GameUiKey, HexKeyCodes, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';
import { defaultHiddenHudComponents } from './player-hud.config';
import { getHeadingTo } from '../util/vector.util';
import { getCash } from './util/player-data.util';
import { registerKeyBind } from '../core/keybind-manager';
import { toggleVehicleHud } from '../vehicle/vehicle-core';


const enum HudActivityState {
  Default,
  OnlyChat,
  All
}

export let isHudActive = gameUiConfig.hud.isActive;
let hudUpdateInterval: NodeJS.Timer | null = null;
let updateInitially = false;
let hudActivityState = HudActivityState.Default;
let lastUpdatedAt = 0;

const hiddenHudComponents: Set<RageEnums.HudComponent> = new Set<RageEnums.HudComponent>(
  [
    ...defaultHiddenHudComponents
  ]
);

function handleHiddenPlayerHudComponents() {
  for (const hudComponent of hiddenHudComponents) {
    mp.game.ui.hideHudComponentThisFrame(hudComponent);
  }
}

export const hidePlayerHudComponent = (hudComponent: RageEnums.HudComponent) => {
  if (hiddenHudComponents.has(hudComponent))
    return;

  hiddenHudComponents.add(hudComponent);
};

export const showPlayerHudComponent = (hudComponent: RageEnums.HudComponent) => {
  hiddenHudComponents.delete(hudComponent);
};


function updateHudHandler() {
  const { x, y, z } = mp.players.local.position;
  const playerHeading = mp.players.local.getHeading();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const path = mp.game.pathfind.getStreetNameAtCoord(x, y, z, 0, 0);
  const zone = mp.game.gxt.get(mp.game.zone.getNameOfZone(x, y, z));
  const street = mp.game.ui.getStreetNameFromHashKey(path.streetName);
  const headingTo = getHeadingTo(playerHeading);

  triggerBrowser(browser, ProcedureKey.BROWSER_UPDATE_LOCATION, [headingTo, zone, street]);

  const now = Date.now();
  if (now - lastUpdatedAt >= 750) {
    lastUpdatedAt = now;
    triggerBrowser(browser, ProcedureKey.BROWSER_UPDATE_PLAYERS, mp.players.length);
  }

  if (!updateInitially) {
    triggerBrowser(browser, ProcedureKey.BROWSER_UPDATE_CASH, getCash());
    triggerBrowser(browser, ProcedureKey.BROWSER_SET_PLAYER_REMOTE_ID, mp.players.local.remoteId);
    updateInitially = true;
  }
}

export function toggleHud(toggle: boolean) {
  isHudActive = toggle;

  if (isHudActive) {
    showGameInterface(GameUiKey.Hud);
    hudUpdateInterval = setInterval(updateHudHandler, 150);
  } else {
    hideGameInterface(GameUiKey.Hud);

    updateInitially = false;

    if (hudUpdateInterval) {
      clearInterval(hudUpdateInterval);
      hudUpdateInterval = null;
    }
  }
}

function cashChangeHandler(entity: EntityMp, value: number, oldValue?: number) {
  if (entity.type != RageEnums.EntityType.PLAYER)
    return;

  if (mp.players.local.remoteId === entity.remoteId) {
    if (value != oldValue) {
      triggerBrowser(browser, ProcedureKey.BROWSER_UPDATE_CASH, value);
    }
  }
}

function selectedItemChangeHandler(entity: EntityMp, value: string | null, oldValue?: string | null) {
  if (entity.type != RageEnums.EntityType.PLAYER)
    return;

  if (mp.players.local.remoteId === entity.remoteId) {
    if (value != oldValue) {
      triggerBrowser(browser, ProcedureKey.BROWSER_UPDATE_SELECTED_ITEM_ID, value);
    }
  }
}

function switchHudState() {
  switch (hudActivityState) {
    case HudActivityState.Default: {
      hudActivityState = HudActivityState.OnlyChat;
      toggleHud(false);
      mp.game.ui.displayRadar(false);
      if (mp.players.local.vehicle)
        toggleVehicleHud(false, true);
      break;
    }

    case HudActivityState.OnlyChat: {
      hudActivityState = HudActivityState.All;
      mp.gui.chat.show(false);
      break;
    }

    case HudActivityState.All: {
      hudActivityState = HudActivityState.Default;
      toggleHud(true);
      mp.game.ui.displayRadar(true);
      if (mp.players.local.vehicle)
        toggleVehicleHud(false, true);
      mp.gui.chat.show(true);
      break;
    }
  }
}

mp.events.addDataHandler(PlayerSharedDataType.Cash, cashChangeHandler);
mp.events.addDataHandler(PlayerSharedDataType.SelectedItemId, selectedItemChangeHandler);
mp.events.add({
  render: handleHiddenPlayerHudComponents
});

registerKeyBind(HexKeyCodes.F7, true, switchHudState);
