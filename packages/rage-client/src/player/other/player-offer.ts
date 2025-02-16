import { triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import { GameUiKey, HexKeyCodes, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { registerKeyBind, unregisterKeyBind } from '../../core/keybind-manager';
import { browser, hideGameInterface, showGameInterface } from '../../core/browser';
import { getHasActiveOffer } from '../util/player-data.util';


const offerKeyBindings: Record<number, VoidFunction> = {
  [HexKeyCodes.PageUp]: acceptOffer,
  [HexKeyCodes.PageDown]: declineOffer
};

let activeOffer: string | null = null;

function acceptOffer() {
  if (getHasActiveOffer()) {
    triggerServer(ProcedureKey.SERVER_PLAYER_OFFER_RESPONSE, true);
  }
}

function declineOffer() {
  if (getHasActiveOffer()) {
    triggerServer(ProcedureKey.SERVER_PLAYER_OFFER_RESPONSE, false);
  }
}

function playerOfferDataHandler(entity: PlayerMp, value: string | null, oldValue?: string) {
  if (entity.type !== RageEnums.EntityType.PLAYER)
    return;

  if (entity.handle === mp.players.local.handle) {
    if (value != oldValue) {
      if (value) {
        activeOffer = value;
        showGameInterface(GameUiKey.Offer);
        setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_INIT_OFFER, value), 100);
        for (const key in offerKeyBindings) {
          registerKeyBind(Number(key), true, offerKeyBindings[key]);
        }
      } else {
        if (!activeOffer)
          return;

        hideGameInterface(GameUiKey.Offer);
        for (const key in offerKeyBindings) {
          unregisterKeyBind(Number(key), offerKeyBindings[key]);
        }
      }
    }
  }
}

mp.events.addDataHandler(PlayerSharedDataType.Offer, playerOfferDataHandler);
