import { OfferHandler, PlayerOffer } from './player-offer.model';


const playerOffers: Map<number, PlayerOffer> = new Map();

export const createPlayerOffer = async (
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

  playerOffers.set(player.id, offer);
};


export const destroyPlayerOffer = (player: PlayerMp) => {
  playerOffers.delete(player.id);
}

export const getPlayerOffer = (player: PlayerMp) => {
  return playerOffers.get(player.id);
};

export const playerResponseOffer = (player: PlayerMp, accepted: boolean) => {
  const playerOffer = getPlayerOffer(player);

  if (playerOffer) {
    if (accepted) {
      playerOffer.accept(player);
    } else {
      playerOffer.decline(player);
    }
  }

  destroyPlayerOffer(player);
}
