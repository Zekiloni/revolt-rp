import { IAudio3D, ProcedureKey } from '@revolt-rp/common';
import { triggerBrowser } from '../core/browser';

export const sounds = new Map<string, IAudio3D & { entity: EntityMp }>();

export const getSoundId = (entity: EntityMp) => {
  return `${entity.type}_${entity.remoteId}`;
};

export function playAudio3D(
  entity: EntityMp,
  audio: IAudio3D
) {
  sounds.set(audio.id, { ...audio, entity });
  triggerBrowser(ProcedureKey.BROWSER_ADD_AUDIO, audio);
}

export function setSoundVolume(id: string, volume: number) {
  sounds.get(id)!.volume = volume;
  triggerBrowser(ProcedureKey.BROWSER_SET_AUDIO_VOLUME, [id, volume]);
}


export function isPlayingSound(id: string): boolean {
  return sounds.has(id);
}

export function destroySound(id: string) {
  if (sounds.has(id)) {
    sounds.delete(id);
    triggerBrowser(ProcedureKey.BROWSER_DESTROY_AUDIO, id);
  }
}

function getVirtualSeek(sound: IAudio3D): number {
  if (sound.paused && sound.pausedAt != null) {
    return sound.pausedAt;
  }

  return (Date.now() - sound.startedAt) / 1000;
}
