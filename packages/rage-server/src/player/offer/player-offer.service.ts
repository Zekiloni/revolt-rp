import { OfferHandler, PlayerOffer } from './player-offer.model';
import { PlayerSharedDataType } from '@revolt-rp/common';


const playerOffers: Map<number, PlayerOffer> = new Map();

export const createPlayerOffer = (
  player: PlayerMp,
  description: string,
  acceptHandler: OfferHandler,
  declineHandler: OfferHandler,
  offerer?: PlayerMp
) => {
  const offer = new PlayerOffer();
  offer.offerer = offerer;
  offer.description = description;

  offer.accept = acceptHandler;
  offer.decline = declineHandler;

  player.setVariable(PlayerSharedDataType.Offer, description);

  playerOffers.set(player.id, offer);
};


export const destroyPlayerOffer = (player: PlayerMp) => {
  console.log('destroyPlayerOffer', player.id);

  playerOffers.delete(player.id);
  if (player && mp.players.at(player.id)) {
    console.log('destroyPlayerOffer, set variable', player.id);
    player.setVariable(PlayerSharedDataType.Offer, null);
  }
};

export const getPlayerOffer = (player: PlayerMp) => {
  return playerOffers.get(player.id);
};

export const playerResponseOffer = (player: PlayerMp, accepted: boolean) => {
  const playerOffer = getPlayerOffer(player);

  console.log('playerResponseOffer', playerOffer);
  if (playerOffer) {
    if (accepted) {
      console.log('accept offer');
      playerOffer.accept(player);
    } else {
      console.log('decline offer');
      playerOffer.decline(player);
    }
  }

  destroyPlayerOffer(player);
};
