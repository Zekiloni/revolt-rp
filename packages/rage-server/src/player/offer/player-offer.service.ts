import { PlayerOffer } from './player-offer.model';


const playerOffers: Map<number, PlayerOffer> = new Map();

export const createPlayerOffer = async (player: PlayerMp, description: string) => {
  const offer = new PlayerOffer();
  offer.author = player;
  offer.description = description;

  playerOffers.set(player.id, offer);
};


export const getPlayerOffer = (player: PlayerMp) => {
  return playerOffers.get(player.id);
};
