import { ISound3D, ProcedureKey } from '@revolt-rp/common';
import { triggerBrowser } from '../core/browser';

export const sounds = new Map<string, ISound3D & { entity: EntityMp }>();

export const getSoundId = (entity: EntityMp) => {
  return `${entity.type}_${entity.remoteId}`;
}

export function playSound3D(
  entity: EntityMp,
  url: string,
  volume = 1,
  range = 10,
): ISound3D {
  const id = getSoundId(entity);

  const sound: ISound3D = {
    id,
    url,
    volume,
    range,
    inVehicle: entity.type === RageEnums.EntityType.VEHICLE,
    paused: false
  };

  sounds.set(id, { ...sound, entity });
  triggerBrowser(ProcedureKey.BROWSER_PLAY_SOUND, [id, url, volume]);

  return sound;
}

export function setSoundVolume(id: string, volume: number) {
  triggerBrowser(ProcedureKey.BROWSER_SET_SOUND_VOLUME, [id, volume]);
}

export function setSoundRange(id: string, range: number) {
  sounds.get(id)!.range = range;
}

export function setSoundPan(id: string, pan: number) {
  triggerBrowser(ProcedureKey.BROWSER_SET_SOUND_PAN, [id, pan]);
}

export function destroySound(id: string) {
  triggerBrowser(ProcedureKey.BROWSER_DESTROY_SOUND, id);
  sounds.delete(id);
}

function pauseSound(id: string) {
  triggerBrowser(ProcedureKey.BROWSER_PAUSE_SOUND, id);
  sounds.get(id)!.paused = true;
}

function resumeSound(id: string) {
  triggerBrowser(ProcedureKey.BROWSER_RESUME_SOUND, id);
  sounds.get(id)!.paused = false;
}

export function  isPlayingSound(id: string): boolean {
  const sound = sounds.get(id);
  if (!sound) return false;

  return !sound.paused;
}
