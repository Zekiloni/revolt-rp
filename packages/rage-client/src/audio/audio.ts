import { IAudio3D, ProcedureKey } from '@revolt-rp/common';
import { triggerBrowser } from '../core/browser';

export const sounds = new Map<string, IAudio3D & { entity: EntityMp }>();

export const getSoundId = (entity: EntityMp) => {
  return `${entity.type}_${entity.remoteId}`;
};

export function playSound3D(
  entity: EntityMp,
  url: string,
  volume = 1,
  range = 10,
  loop = false
): IAudio3D {
  const id = getSoundId(entity);

  const audio: IAudio3D = {
    id,
    url,
    volume,
    source: {
      type: entity.type === RageEnums.EntityType.VEHICLE ? 'vehicle' : 'object',
      id: entity.remoteId
    },
    range,
    loop,
    position: entity.getCoords(false),
    paused: false
  };

  sounds.set(id, { ...audio, entity });
  triggerBrowser(ProcedureKey.BROWSER_ADD_AUDIO, [id, url, volume]);

  return audio;
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
