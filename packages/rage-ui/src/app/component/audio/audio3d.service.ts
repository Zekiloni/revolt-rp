import { inject, Injectable } from '@angular/core';
import { IAudio3D } from '@revolt-rp/common';
import { AudioStreamApiService } from '@revolt-rp/common-ui';

type  AudioSpot = IAudio3D & {
  audio: HTMLAudioElement;
  panner: PannerNode;
  biquadFilter: BiquadFilterNode;
  gainNode: GainNode;
}

@Injectable({ providedIn: 'root' })
export class Audio3dService {
  private audioStreamApiService = inject(AudioStreamApiService);
  private audioContext: AudioContext | null = null;
  private audioSpots = new Map<string, AudioSpot>();

  private createAudioContext() {
    if (!this.audioContext) this.audioContext = new AudioContext();
  }

  addAudio(audioCreate: IAudio3D) {
    this.createAudioContext();

    const { id, url, volume, range, loop, position: { x, y, z } } = audioCreate;

    let streamUrl = url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      console.log('Using audio stream proxy for URL:', url);
      streamUrl = this.audioStreamApiService.getAudioStreamUrl(url);
      console.log('Proxied URL:', streamUrl);
    }

    if (this.audioSpots.has(id)) {
      const spot = this.audioSpots.get(id)!;
      spot.audio.volume = volume;

      if (spot.range !== range) {
        spot.panner.maxDistance = range;
        spot.range = range;
      }
      if (streamUrl !== spot.audio.src) {
        spot.audio.src = streamUrl;
        spot.audio.load();
        spot.audio.play().catch(() => console.log('Audio failed to play', id));
      }

      return;
    }

    console.log('Adding 3D audio with ID:', id, 'URL:', url);

    const audio = new Audio();
    audio.src = streamUrl;
    audio.crossOrigin = 'anonymous';
    audio.loop = loop;
    audio.volume = volume;
    audio.load();

    if (!this.audioContext) return;

    const panner = new PannerNode(this.audioContext, {
      panningModel: 'HRTF',
      distanceModel: 'exponential',
      refDistance: 1,
      maxDistance: range,
      rolloffFactor: 1,
      coneInnerAngle: 360,
      coneOuterAngle: 0,
      coneOuterGain: 0,
      positionX: x,
      positionY: y,
      positionZ: z
    });

    const biquadFilter = new BiquadFilterNode(this.audioContext, { type: 'allpass' });

    const track = this.audioContext.createMediaElementSource(audio);
    // track.connect(panner).connect(biquadFilter).connect(this.audioContext.destination);

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;

    track
      .connect(panner)
      .connect(biquadFilter)
      .connect(gainNode)
      .connect(this.audioContext.destination);

    audio.onloadeddata = () => audio.play().catch(() => console.log('Audio failed to play', id));

    this.audioSpots.set(id, { ...audioCreate, id, audio, panner, biquadFilter, range, gainNode });
  }

  removeAudio(id: string) {
    const spot = this.audioSpots.get(id);
    if (!spot) return;
    spot.audio.pause();
    spot.audio.src = '';
    spot.panner.disconnect();
    spot.biquadFilter.disconnect();
    this.audioSpots.delete(id);
  }

  fadeAudio(
    spot: AudioSpot,
    targetVolume: number,
    durationMs = 500
  ) {
    if (!spot || !this.audioContext) return;

    const now = this.audioContext.currentTime;
    const gain = spot.gainNode.gain;

    // Cancel any previous automation
    gain.cancelScheduledValues(now);

    // Start from current value (important!)
    gain.setValueAtTime(gain.value, now);

    // Smooth fade
    gain.linearRampToValueAtTime(
      targetVolume,
      now + durationMs / 1000
    );
  }

  setAudioVolumeByDistance(spot: AudioSpot) {
    if (!spot) return;

    const listenerPos = this.audioContext?.listener.positionX.value ?? 0;
    const listenerY = this.audioContext?.listener.positionY.value ?? 0;
    const listenerZ = this.audioContext?.listener.positionZ.value ?? 0;

    const dx = spot.panner.positionX.value - listenerPos;
    const dy = spot.panner.positionY.value - listenerY;
    const dz = spot.panner.positionZ.value - listenerZ;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const maxDistance = spot.range;

    const volume = Math.max(0, 1 - distance / maxDistance);
    this.fadeAudio(spot, volume, 100);
  }

  setListenerPosition(x: number, y: number, z: number) {
    this.createAudioContext();
    if (!this.audioContext) return;

    this.audioContext.listener.positionX.value = x;
    this.audioContext.listener.positionY.value = y;
    this.audioContext.listener.positionZ.value = z;
  }

  setListenerOrientation(forwardX: number, forwardY: number, forwardZ: number) {
    this.createAudioContext();

    if (!this.audioContext) return;

    this.audioContext.listener.forwardX.value = forwardX;
    this.audioContext.listener.forwardY.value = forwardY;
    this.audioContext.listener.forwardZ.value = forwardZ;
    this.audioContext.listener.upX.value = 0;
    this.audioContext.listener.upY.value = 0;
    this.audioContext.listener.upZ.value = 1;
  }

  setAudioPosition(id: string, x: number, y: number, z: number) {
    const spot = this.audioSpots.get(id);
    if (!spot) return;
    spot.panner.positionX.value = x;
    spot.panner.positionY.value = y;
    spot.panner.positionZ.value = z;

    this.setAudioVolumeByDistance(spot);
  }

  setAudioMuffled(id: string, muffled: boolean) {
    const spot = this.audioSpots.get(id);
    if (!spot) return;
    spot.biquadFilter.type = muffled ? 'lowpass' : 'allpass';
  }

  setAudioVolume(id: string, volume: number) {
    const spot = this.audioSpots.get(id);
    if (!spot) return;
    spot.audio.volume = volume;
  }

  pauseAudio(id: string) {
    this.audioSpots.get(id)?.audio.pause();
  }

  resumeAudio(id: string) {
    this.audioSpots.get(id)?.audio.play().catch(() => {
      console.log('Audio failed to play', id);
    });
  }
}
