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


const AUDIO_DEBUG = true;

const entities = [RageEnums.EntityType.VEHICLE, RageEnums.EntityType.OBJECT, RageEnums.EntityType.DUMMY];

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

function drawLine(from: Vector3, to: Vector3, r: number, g: number, b: number) {
  mp.game.graphics.drawLine(
    from.x, from.y, from.z,
    to.x, to.y, to.z,
    r, g, b, 255
  );
}

function drawRangeSphere(pos: Vector3, range: number) {
  mp.game.graphics.drawMarker(
    28, // sphere
    pos.x, pos.y, pos.z,
    0, 0, 0,
    0, 0, 0,
    range * 2, range * 2, range * 2,
    0, 150, 255, 40,
    false, false, 2, false, null, null, false
  );
}

function drawSoundSource(pos: Vector3) {
  mp.game.graphics.drawMarker(
    1,
    pos.x, pos.y, pos.z + 0.5,
    0, 0, 0,
    0, 0, 0,
    0.3, 0.3, 0.3,
    255, 0, 0, 200,
    false, false, 2, false, null, null, false
  );
}

function drawPanVector(listenerPos: Vector3, pan: number) {
  const camRight = getCameraRightVector();

  const panVec = new mp.Vector3(
    camRight.x * pan * 2,
    camRight.y * pan * 2,
    0
  );

  drawLine(
    listenerPos,
    new mp.Vector3(
      listenerPos.x + panVec.x,
      listenerPos.y + panVec.y,
      listenerPos.z
    ),
    pan > 0 ? 0 : 255,
    255,
    pan > 0 ? 255 : 0
  );
}
function smooth(current: number, target: number, speed = 0.1) {
  return current + (target - current) * speed;
}
function getVehicleMuffleFactor(vehicle: VehicleMp, listenerInVehicle: boolean) {
  let windowsOpen = 0;
  let doorsOpen = 0;

  for (let i = 0; i < 4; i++) {
    if (isVehicleWindowOpen(vehicle, i)) windowsOpen++;
    if (isVehicleDoorOpen(vehicle, i)) doorsOpen++;
  }

  const openness = clamp(windowsOpen * 0.15 + doorsOpen * 0.25, 0, 1);

  // 🔑 Base factor reduced for both inside/outside
  // Now max volume inside vehicle won't reach 1.0, more realistic
  const baseFactor = listenerInVehicle ? 0.7 : 0.5;

  // 🔊 Open doors/windows reduce muffling slightly
  const factor = baseFactor + openness * 0.25;

  return clamp(factor, 0.2, 1); // minimum 0.2, maximum 1
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

  const camRight = getCameraRightVector();
  normalize(camRight);

  // Dot product gives pan directly
  return clamp(
    dir.x * camRight.x + dir.y * camRight.y,
    -1,
    1
  );
}

function drawText(text: string, x: number, y: number, scale = 0.35) {
  mp.game.graphics.drawText(text, [x, y], {
    font: 0,
    color: [255, 255, 255, 200],
    scale: [scale, scale],
    outline: true
  });
}

function drawSoundDebug(pos: Vector3, range: number, volume: number) {
  mp.game.graphics.drawMarker(
    1,
    pos.x, pos.y, pos.z - 1,
    0, 0, 0,
    0, 0, 0,
    range * 2, range * 2, 1,
    255,
    Math.floor(255 * volume),
    0,
    80,
    false,
    false,
    2,
    false,
    null,
    null,
    false
  );
}

mp.events.add('render', () => {
  const { position, dimension, vehicle } = mp.players.local;

  sounds.forEach(sound => {
    if (sound.paused) return;

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

    // 🔊 Calculate a temporary volume variable only
    let calculatedVolume = sound.volume * (1 - dist / sound.range);

    if (entity.type === RageEnums.EntityType.VEHICLE) {
      const veh = entity as VehicleMp;
      const listenerInVehicle = vehicle && vehicle.handle === veh.handle;
      const soundInVehicle = sound.inVehicle;

      if (listenerInVehicle && soundInVehicle) {
        calculatedVolume = sound.volume;
      } else {
        calculatedVolume *= getVehicleMuffleFactor(veh, listenerInVehicle);
      }
    }

    calculatedVolume = clamp(calculatedVolume);

    // 🔄 Smooth the actual audio without touching sound.volume
    setSoundVolume(sound.id, calculatedVolume);

    // Pan
    const pan = calculateStereoPan(position, soundPos);
    setSoundPan(sound.id, pan);

    if (AUDIO_DEBUG) {
      drawSoundDebug(soundPos, sound.range, calculatedVolume);
      drawSoundSource(soundPos);
      drawRangeSphere(soundPos, sound.range);
      drawLine(position, soundPos, 255, 255, 0);
      drawPanVector(position, pan);
      drawText(
        `Sound: ${sound.id}\nDist: ${dist.toFixed(2)}\nVol: ${calculatedVolume.toFixed(2)}\nPan: ${pan.toFixed(2)}\nVeh: ${entity.type === RageEnums.EntityType.VEHICLE}`,
        0.21, 0.35
      );
    }
  });
});


function handleEntitySoundData(entity: EntityMp, oldValue: ISound3D | undefined, newValue: ISound3D | undefined) {
  const soundId = getSoundId(entity);

  mp.gui.chat.push('Handling sound data for entity ' + entity.type + ' ' + entity.id);
  if (oldValue && !newValue) {
    if (isPlayingSound(soundId) === false) return;

    mp.gui.chat.push('Destroying sound for entity ' + entity.type + ' ' + entity.id);
    destroySound(soundId);
    return;
  }

  if (newValue) {
    mp.gui.chat.push('Updating/Creating sound for entity ' + entity.type + ' ' + entity.id);
    if (isPlayingSound(soundId)) {
      mp.gui.chat.push('Updating sound for entity ' + entity.type + ' ' + entity.id);
      const sound = sounds.get(soundId)!;
      sound.url = newValue.url;
      sound.volume = newValue.volume;
      sound.range = newValue.range;
      sound.inVehicle = newValue.inVehicle;

      setSoundVolume(soundId, newValue.volume);
    } else {
      mp.gui.chat.push('Creating sound for entity ' + entity.type + ' ' + entity.id);
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
