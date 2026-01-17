import { inject, Injectable } from '@angular/core';
import { API_BASE_HREF } from '../variables';

@Injectable({ providedIn: 'root' })
export class AudioStreamApiService {
  private BASE_API_URL = inject(API_BASE_HREF);

  getAudioStreamUrl(audioUrl: string) {
    const params = new URLSearchParams({ url: audioUrl });
    return `${this.BASE_API_URL}/api/audio-stream/?${params.toString()}`;
  }
}
