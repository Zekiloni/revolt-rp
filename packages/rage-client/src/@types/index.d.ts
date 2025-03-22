declare global {

  interface PlayerMp {
    lastDamageAt: number | null;
  }

  const enum RotationOrder {
    XYZ = 0,
    XZY,
    YXZ,
    YZX,
    ZXY,
    ZYX,
    MAX,
  }

  declare class ObjectMp {
    applyForceTo(
      forceType: number,
      x: number,
      y: number,
      z: number,
      xRot: number,
      yRot: number,
      zRot: number,
      boneIndex: number,
      isRel: boolean,
      p9: boolean,
      highForce: boolean,
      p11: boolean,
      p12: boolean
    ): void;
  }

  declare namespace RageEnums {

    namespace Hud {
      const enum Component {
        HUD_RETICLE = 14
      }
    }

    const enum HeadOverlays {
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

    const enum VehicleSeat {
      DRIVER = -1,
      PASSENGER = 0,
      LEFT_REAR = 1,
      RIGHT_REAR = 2
    }
  }

  declare interface DiscordMp {
    requestOAuth2(applicationId: string): Promise<string>;
  }
}

export {};
