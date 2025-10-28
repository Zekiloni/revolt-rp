import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { provideEffects } from '@ngrx/effects';
import { providePrimeNG } from 'primeng/config';
import { provideStore } from '@ngrx/store';
import { appRoutes } from './app.routes';
import RevoltPreset from './revolt-preset';
import { authReducer } from './core/store/auth/auth.reducer';
import { API_BASE_HREF } from './core/config/variables';
import { environment } from '../environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideStore({
      auth: authReducer,
    }),
    provideEffects(),
    providePrimeNG({
      theme: {
        preset: RevoltPreset,
        options: {
          ripple: true,
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      }
    }),
    {
      provide: API_BASE_HREF,
      useValue: environment.apiUrl
    }
  ],
};
