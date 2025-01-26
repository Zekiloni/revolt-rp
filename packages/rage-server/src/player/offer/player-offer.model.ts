export type OfferHandler = (player: PlayerMp) => void;

export class PlayerOffer {
  offerer?: PlayerMp;
  description: string;
  accept: OfferHandler;
  decline: OfferHandler;
}
