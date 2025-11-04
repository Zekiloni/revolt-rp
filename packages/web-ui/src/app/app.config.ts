import { provideAppInitializer, ApplicationConfig, isDevMode, provideZoneChangeDetection, inject } from '@angular/core';

import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { providePrimeNG } from 'primeng/config';
import { provideStore } from '@ngrx/store';
import { appRoutes } from './app.routes';
import RevoltPreset from './revolt-preset';
import { authReducer } from './core/store/auth/auth.reducer';
import { environment } from '../environments/environment';
import { authInterceptor } from './core/util/auth.interceptor';
import { AuthService } from './core/service/auth.service';
import { apiErrorInterceptor } from './core/util/api-error.interceptor';
import { MessageService } from 'primeng/api';
import { API_BASE_HREF } from '@revolt-rp/common-ui';


export const appConfig: ApplicationConfig = {
  providers: [
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(),withInterceptors([authInterceptor, apiErrorInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideEffects(),
    provideStore({
      auth: authReducer
    }),
    {
      provide: API_BASE_HREF,
      useValue: environment.apiUrl
    },
    {
      provide: AuthService,
      useClass: AuthService
    },
    MessageService,
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.initializeAsync();
    }),
    providePrimeNG({
      theme: {
        preset: RevoltPreset,
        options: {
          ripple: true,
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      }
    })
  ]
};
