import { destroySound, getSoundId, isPlayingSound, playAudio3D, sounds } from './audio';
import { EntitySharedDataType, IAudio3D, ProcedureKey } from '@revolt-rp/common';
import { isVehicleDoorOpen, isVehicleWindowOpen } from '../vehicle/vehicle-core';
import { triggerBrowser } from '../core/browser';
import { distanceTo, getForwardVector3D } from '../util/vector.util';


const DOORS_WINDOWS_ARRAY = [...Array(7).keys()];

const isSuitableEntity = (entity: EntityMp) => {
  return [RageEnums.EntityType.VEHICLE, RageEnums.EntityType.OBJECT].includes(entity.type);
};

const getEntitySound = (entity: EntityMp): IAudio3D | null => {
  return entity.getVariable<IAudio3D | undefined>(EntitySharedDataType.SOUND);
};


const isVehicleSoundMuffled = (vehicle: VehicleMp) =>
  DOORS_WINDOWS_ARRAY.every(i => !isVehicleWindowOpen(vehicle, i) && !isVehicleDoorOpen(vehicle, i));


function handleSounds(): void {
  sounds.forEach(sound => {
    if (sound.paused) return;

    const entity = sound.entity;
    if (!entity || !entity.handle) {
      triggerBrowser(ProcedureKey.BROWSER_DESTROY_AUDIO, sound.id);
      return;
    }

    if (entity.dimension !== mp.players.local.dimension) {
      triggerBrowser(ProcedureKey.BROWSER_DESTROY_AUDIO, sound.id);
      return;
    }

    triggerBrowser(ProcedureKey.BROWSER_SET_LISTENER_POSITION, [mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z]);
    const orientation = getForwardVector3D(mp.game.cam.getGameplayCamRot(2));
    triggerBrowser(ProcedureKey.BROWSER_SET_LISTENER_ORIENTATION, [orientation.x, orientation.y, orientation.z]);

    let isMuffled = false;
    if (entity.type === RageEnums.EntityType.VEHICLE) {
      const vehicle = entity as VehicleMp;

      const playerInVehicle = mp.players.local.vehicle && mp.players.local.vehicle.handle === vehicle.handle;

      sound.position = playerInVehicle ? mp.players.local.position : vehicle.position;
      isMuffled = sound.loop || playerInVehicle ? false : isVehicleSoundMuffled(vehicle);
    } else {
      sound.position = entity.getCoords(false);
    }

    triggerBrowser(ProcedureKey.BROWSER_SET_AUDIO_POSITION, [sound.id, sound.position.x, sound.position.y, sound.position.z]);
    triggerBrowser(ProcedureKey.BROWSER_SET_MUFFLED, [sound.id, isMuffled]);

    const distance = distanceTo(mp.players.local.position, sound.position);

    if (distance > sound.range) {
      triggerBrowser(ProcedureKey.BROWSER_DESTROY_AUDIO, sound.id);
      return;
    }

    const volume = (sound.range - distance) / sound.range * sound.volume;
    triggerBrowser(ProcedureKey.BROWSER_ADD_AUDIO, { ...sound, volume });
  });
}


function handleEntitySoundData(entity: EntityMp, newValue: IAudio3D | undefined, oldValue: IAudio3D | undefined) {
  const soundId = getSoundId(entity);

  mp.gui.chat.push('Handling sound data for entity ' + entity.type + ' ' + entity.id);
  if (oldValue && !newValue) {
    if (isPlayingSound(soundId)) {
      destroySound(soundId);
    }
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
    } else {
      mp.gui.chat.push('Creating sound for entity ' + entity.type + ' ' + entity.id);
      playAudio3D(entity, newValue);
    }
  }
}

setInterval(handleSounds, 250);
mp.events.addDataHandler(EntitySharedDataType.SOUND, handleEntitySoundData);
mp.events.add({
  entityStreamIn: (entity: EntityMp) => {
    if (!isSuitableEntity(entity) === false) return;
    const sound = getEntitySound(entity);
    if (!getEntitySound(entity)) return;

    playAudio3D(entity, sound);
  },
  entityStreamOut: (entity: EntityMp) => {
    const soundId = getSoundId(entity);
    if (isPlayingSound(soundId) === false) return;
  }
});

