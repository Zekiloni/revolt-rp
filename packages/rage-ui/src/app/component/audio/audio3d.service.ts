import { Injectable } from '@angular/core';
import { Howl } from 'howler';

interface CefSound {
  howl: Howl;
  volume: number;
}

@Injectable({ providedIn: 'root' })
export class Audio3dService {
  private sounds = new Map<number, CefSound>();

  createSound(id: number, url: string, volume: number) {
    if (this.sounds.has(id)) return;

    const howl = new Howl({
      src: [url],
      html5: true,
      loop: true,
      volume
    });

    this.sounds.set(id, { howl, volume });
    howl.play();
  }

  setVolume(id: number, volume: number) {
    const sound = this.sounds.get(id);
    if (!sound) return;

    sound.howl.volume(volume);
    sound.volume = volume;
  }

  pause(id: number) {
    this.sounds.get(id)?.howl.pause();
  }

  resume(id: number) {
    this.sounds.get(id)?.howl.play();
  }

  setPan(id: number, pan: number) {
    this.sounds.get(id)?.howl.stereo(pan);
  }

  destroy(id: number) {
    const sound = this.sounds.get(id);
    if (!sound) return;

    sound.howl.stop();
    sound.howl.unload();
    this.sounds.delete(id);
  }
}
