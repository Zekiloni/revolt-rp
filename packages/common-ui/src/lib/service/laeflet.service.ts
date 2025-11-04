import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LeafletService {
  private L: typeof import('leaflet') | null = null;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async loadLeaflet(): Promise<typeof import('leaflet')> {
    if (!this.isBrowser) {
      throw new Error('Leaflet cannot be loaded on the server.');
    }

    if (!this.L) {
      this.L = await import('leaflet');
    }

    return this.L;
  }
}
