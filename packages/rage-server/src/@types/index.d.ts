import './node';
import { Account } from '../player/account/account.model';
import { Character } from '../player/character/character.model';
import { Vehicle } from '../vehicle/vehicle.model';
import { ProcedureListenerInfo } from '@libertymp/rage-rpc';

declare global {

  interface PlayerMp {
    account: Account;
    character: Character;

    lastVehicle: VehicleMp | null;
    isSpectating: boolean | undefined;
  }

  interface VehicleMp {
    info: Vehicle;
  }

  interface DummyMp {
    getVariable<T = any>(name: string): T | null;

    getOwnVariable<T = any>(name: string): T | null;

    setVariable(name: string, value: any): void;

    setVariables(values: KeyValueCollection): void;
  }

  interface ColshapeMp {
    onPlayerEnter(player: PlayerMp): void;

    onPlayerExit(player: PlayerMp): void;
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

    export const enum ClothesComponent {
      HEAD = 0,
      MASK = 1,
      HAIR = 2,
      TORSO = 3,
      LEGS = 4,
      BAGS = 5,
      SHOES = 6,
      ACCESSORIES_1 = 7,
      ACCESSORIES_2 = 8,
      BODY_ARMORS = 9,
      DECALS = 10,
      AUXILIARY = 11
    }

    export const enum Weather {
      NEUTRAL = 'NEUTRAL',
      SNOW = 'SNOW',
    }
  }

  declare type EmbedField = {
    name: string;
    value: string;
    inline?: boolean;
  };

  declare type EmbedFooter = {
    text: string;
    icon_url: string;
  };

  declare type DiscordEmbed = {
    title: string;
    description: string;
    color: number;
    fields?: EmbedField[];
    footer?: EmbedFooter;
    timestamp?: string;
  };

  declare type DiscordWebhookPayload = {
    username: string;
    avatar_url?: string;
    content?: string;
    embeds?: DiscordEmbed[];
  };

  declare type ServerProcedureListenerInfo = ProcedureListenerInfo<PlayerMp>;
}

declare module "@ragempcommunity/types-server" {

}
