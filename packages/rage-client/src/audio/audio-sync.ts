import { destroySound, getSoundId, isPlayingSound, playSound3D, setSoundPan, setSoundVolume, sounds } from './audio';
import { EntitySharedDataType, ISound3D } from '@revolt-rp/common';
import { isVehicleDoorOpen, isVehicleWindowOpen } from '../vehicle/vehicle-core';

// 3D Sound API with Howler.js,
//   Play sounds at a position or on an entity,
//   If entity move the sound can move with it (example radio for vehicles),
// If entity is a vehicle sound decrease/increase when doors closed/opened,
//   Pause, resume and set volume,
//   Synchronized thanks to Entity Sync with seek resume when in range.
//   Virtual Seek : When the sound streamed out play it virtually server side and resume it when streamed in.


const entities = [RageEnums.EntityType.VEHICLE, RageEnums.EntityType.OBJECT, RageEnums.EntityType.DUMMY];

let lastCheckAt = Date.now();

const isSuitableEntity = (entity: EntityMp) => {
  return entities.includes(entity.type);
};

const getEntitySound = (entity: EntityMp): ISound3D | null => {
  return entity.getVariable<ISound3D | undefined>(EntitySharedDataType.SOUND);
};

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function getDistance(a: Vector3, b: Vector3) {
  return mp.game.system.vdist(a.x, a.y, a.z, b.x, b.y, b.z);
}

function getVehicleMuffleFactor(vehicle: VehicleMp, listenerInVehicle: boolean) {
  let factor = listenerInVehicle ? 1.1 : 0.55;

  let windowsOpen = 0;
  for (let i = 0; i < 4; i++) {
    if (isVehicleWindowOpen(vehicle, i)) windowsOpen++;
  }

  let doorsOpen = 0;
  for (let i = 0; i < 4; i++) {
    if (isVehicleDoorOpen(vehicle, i)) doorsOpen++;
  }

  factor += windowsOpen * 0.1;
  factor += doorsOpen * 0.15;

  return clamp(factor, 0, 1.4);
}

function normalize(v: Vector3) {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (len === 0) return v;
  v.x /= len;
  v.y /= len;
  v.z /= len;
  return v;
}

function getCameraRightVector(): Vector3 {
  const camRot = mp.game.cam.getGameplayCamRot(2);

  const radZ = camRot.z * Math.PI / 180;

  return new mp.Vector3(
    Math.cos(radZ),
    Math.sin(radZ),
    0
  );
}

function calculateStereoPan(listenerPos: Vector3, soundPos: Vector3): number {
  const dir = new mp.Vector3(
    soundPos.x - listenerPos.x,
    soundPos.y - listenerPos.y,
    0
  );

  normalize(dir);

  const right = getCameraRightVector();

  // Dot product → left/right
  const pan = dir.x * right.x + dir.y * right.y;

  return clamp(pan, -1, 1);
}

mp.events.add('render', () => {
  const { position, dimension, vehicle } = mp.players.local;

  sounds.forEach(sound => {
    if (lastCheckAt + 250 > Date.now())
      return;

    if (sound.paused)
      return;

    const entity = sound.entity;

    if (!entity || !entity.handle) {
      destroySound(sound.id);
      return;
    }

    if (entity.dimension !== dimension) {
      setSoundVolume(sound.id, 0);
      return;
    }

    const soundPos = entity.position;
    const dist = getDistance(position, soundPos);

    if (dist > sound.range) {
      setSoundVolume(sound.id, 0);
      return;
    }

    // 🔊 Base distance attenuation
    let volume = sound.volume * (1 - dist / sound.range);

    // 🚗 Vehicle-specific logic
    if (entity.type === RageEnums.EntityType.VEHICLE) {
      const veh = entity as VehicleMp;

      const listenerInVehicle = vehicle && vehicle.handle === veh.handle;
      const soundInVehicle = sound.inVehicle;

      if (listenerInVehicle && soundInVehicle) {
        volume *= 1.3;
      } else {
        volume *= getVehicleMuffleFactor(veh, listenerInVehicle);
      }
    }

    setSoundVolume(sound.id, clamp(volume));

    const pan = calculateStereoPan(position, soundPos);
    setSoundPan(sound.id, pan);

    lastCheckAt = Date.now();
  });
});

function handleEntitySoundData(entity: EntityMp, oldValue: ISound3D | undefined, newValue: ISound3D | undefined) {
  const soundId = getSoundId(entity);

  if (oldValue && !newValue) {
    if (isPlayingSound(soundId) === false) return;

    destroySound(soundId);
    return;
  }

  if (newValue) {
    if (isPlayingSound(soundId)) {
      const sound = sounds.get(soundId)!;
      sound.url = newValue.url;
      sound.volume = newValue.volume;
      sound.range = newValue.range;
      sound.inVehicle = newValue.inVehicle;

      setSoundVolume(soundId, newValue.volume);
    } else {
      playSound3D(entity, newValue.url, newValue.volume, newValue.range);
    }
  }
}

mp.events.addDataHandler(EntitySharedDataType.SOUND, handleEntitySoundData);

mp.events.add({
  entityStreamIn: (entity: EntityMp) => {
    if (!isSuitableEntity(entity) === false) return;
    const sound = getEntitySound(entity);
    if (!getEntitySound(entity)) return;

    playSound3D(entity, sound.url, sound.volume, sound.range);
  },
  entityStreamOut: (entity: EntityMp) => {
    const soundId = getSoundId(entity);
    if (isPlayingSound(soundId) === false) return;

    destroySound(soundId);
  }
});
