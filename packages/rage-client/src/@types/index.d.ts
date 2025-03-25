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

    namespace Player {
      const enum ConfigFlag {
        CAN_PUNCH = 18,
        CAN_FLY_THRU_WINDSCREEN = 32,
        DIES_BY_RAGDOLL = 33,
        CAN_PUT_MOTORCYCLE_HELMET = 35,
        NO_COLLISION = 52,
        IS_SHOOTING = 58,
        IS_ON_GROUND = 60,
        NO_COLLIDE = 62,
        DEAD = 71,
        IS_SNIPER_SCOPE_ACTIVE = 72,
        SUPER_DEAD = 73,
        IS_IN_AIR = 76,
        IS_AIMING = 78,
        DRUNK = 100,
        IS_NOT_RAGDOLL_AND_NOT_PLAYING_ANIM = 104,
        NO_PLAYER_MELEE = 122,
        NM_MESSAGE_466 = 125,
        REMOVE_HELMET_DAMAGE_REDUCTION_1 = 149,
        INJURED_LIMP = 166,
        INJURED_LIMP_2 = 170,
        AUTOMATIC_SEAT_SHUFFLE = 184,
        INJURED_DOWN = 187,
        SHRINK = 223,
        MELEE_COMBAT = 224,
        DISABLE_STOPPING_VEH_ENGINE = 241,
        IS_ON_STAIRS = 253,
        HAS_ONE_LEG_ON_GROUND = 276,
        NO_WRITHE = 281,
        FREEZE = 292,
        IS_STILL = 301,
        NO_PED_MELEE = 314,
        SWITCHING_WEAPON = 331,
        ALPHA = 410,
        FLAMING_FOOTPRINTS = 421,
        DISABLE_PROP_KNOCK_OFF = 423,
        STOP_ENGINE_TURNING = 429,
        REMOVE_HELMET_DAMAGE_REDUCTION_2 = 438
      }
    }

    namespace Natives {
      const enum GRAPHICS {
        SET_CHECKPOINT_DIRECTION = '0x3C788E7F6438754D'
      }
    }

    namespace Vehicle {
      const enum DoorIndex {
        FRONT_LEFT_DOOR,
        FRONT_RIGHT_DOOR,
        BACK_LEFT_DOOR,
        BACK_RIGHT_DOOR,
        HOOD,
        TRUNK,
        BACK,
        BACK_2
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
