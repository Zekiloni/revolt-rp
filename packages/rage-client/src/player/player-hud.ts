import { triggerBrowser } from '@libertymp/rage-rpc';
import { gameUiConfig, GameUiKey, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';
import { defaultHiddenHudComponents } from './player-hud.config';
import { getHeadingTo } from '../util/vector.util';
import { getCash } from './util/player-data.util';


let isHudActive = gameUiConfig.hud.isActive;
let hudUpdateInterval: NodeJS.Timer | null = null;
let updateInitially = false;

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

  if (!updateInitially) {
    triggerBrowser(browser, ProcedureKey.BROWSER_UPDATE_CASH, getCash());
    triggerBrowser(browser, ProcedureKey.BROWSER_SET_PLAYER_REMOTE_ID, mp.players.local.remoteId);
    updateInitially = true;
  }
}

export function toggleHud(toggle: true) {
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


mp.events.addDataHandler(PlayerSharedDataType.Cash, cashChangeHandler);
mp.events.addDataHandler(PlayerSharedDataType.SelectedItemId, selectedItemChangeHandler);
mp.events.add({
  render: handleHiddenPlayerHudComponents
});

