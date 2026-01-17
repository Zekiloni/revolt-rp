import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideTranslateService } from '@ngx-translate/core';

import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';

import RevoltPreset from './revolt-preset';

import { routes } from './app.routes';
import { phoneReducer } from './store/phone';
import { environment } from '../environments/environment';
import { inventoryReducer } from './store/inventory/inventory.reducer';
import { gameInterfaceReducer } from './store/game-ui/game-ui.reducer';
import { RageClientService } from './domain/service/rage-client.service';
import { API_BASE_HREF } from '@revolt-rp/common-ui';
import { provideRouter, withHashLocation } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideEffects(),
    provideRouter(routes, withHashLocation()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimationsAsync(),
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
    }),
    provideTranslateService({
      defaultLanguage: environment.DEFAULT_LANGUAGE
    }),
    MessageService,
    ConfirmationService,
    RageClientService,
    provideStore({
      gameInterface: gameInterfaceReducer,
      inventory: inventoryReducer,
      phone: phoneReducer
    }),
    {
      provide: API_BASE_HREF,
      useValue: environment.API_BASE_HREF
    }
  ]
};
