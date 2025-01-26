import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { destroyPlayerOffer, playerResponseOffer } from './player-offer.service';

function playerQuitOfferHandler(player: PlayerMp) {
  destroyPlayerOffer(player);
}

function playerOfferResponseHandler(accepted: boolean, { player }: ProcedureListenerInfo<PlayerMp>) {
  playerResponseOffer(player, accepted);
}


mp.events.add({
  playerQuit: playerQuitOfferHandler
});

on(ProcedureKey.SERVER_PLAYER_OFFER_RESPONSE, playerOfferResponseHandler);
