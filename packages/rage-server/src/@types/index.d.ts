import './node';
import { Account } from '../player/account/account.model';
import { Character } from '../player/character/character.model';

declare global {


  interface PlayerMp {
    account: Account;
    character: Character;
  }

  interface VehicleMp {
  }

  declare namespace RageEnums {
    export const enum HeadOverlays {
      Blemishes = 0,
      FacialHair = 1,
      Eyebrows = 2,
      Ageing = 3,
      Makeup = 4,
      Blush = 5,
      Complexion = 6,
      SunDamage = 7,
      Lipstick = 8,
      MolesFreckles = 9,
      ChestHair = 10,
      BodyBlemishes = 11,
      AddBodyBlemishes = 12
    }
  }
}
