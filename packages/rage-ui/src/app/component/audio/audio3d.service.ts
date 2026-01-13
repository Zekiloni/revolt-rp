import { Injectable } from '@angular/core';
import { Howl } from 'howler';

interface CefSound {
  howl: Howl;
  volume: number;
}

@Injectable({ providedIn: 'root' })
export class Audio3dService {
  private sounds = new Map<string, CefSound>();

  getSounds() {
    return this.sounds;
  }

  createSound(id: string, url: string, volume: number) {
    if (this.sounds.has(id)) return;

    const howl = new Howl({
      src: [url],
      html5: false,
      loop: false,
      volume,
    });

    howl.stereo(0)
    howl.pos(0, 0, 0)
    this.sounds.set(id, { howl, volume });
    howl.play();
    console.log('Creating sound', id, url, volume);
  }

  setVolume(id: string, volume: number) {
    console.log('Setting volume for', id, volume);
    const sound = this.sounds.get(id);
    if (!sound) return;

    sound.howl.volume(volume);
    sound.volume = volume;
    console.log('Volume set for', id, volume);
  }

  pause(id: string) {
    this.sounds.get(id)?.howl.pause();
  }

  isPaused(id: string): boolean {
    const sound = this.sounds.get(id);
    if (!sound) return true;

    return !sound.howl.playing();
  }

  resume(id: string) {
    this.sounds.get(id)?.howl.play();
  }

  setPan(id: string, pan: number) {
    console.log('Setting pan for', id, pan);
    this.sounds.get(id)?.howl.stereo(pan);
  }

  destroy(id: string) {
    const sound = this.sounds.get(id);
    if (!sound) return;

    sound.howl.stop();
    sound.howl.unload();
    this.sounds.delete(id);
  }
}
