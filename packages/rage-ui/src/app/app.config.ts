import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideTranslateService } from '@ngx-translate/core';

import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeng/themes/aura';

import { phoneReducer } from './store/phone';
import { BASE_HREf } from './domain/variables';
import { environment } from '../environments/environment';
import { inventoryReducer } from './store/inventory/inventory.reducer';
import { gameInterfaceReducer } from './store/game-ui/game-ui.reducer';
import { RageClientService } from './domain/service/rage-client.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideEffects(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideTranslateService({
      defaultLanguage: environment.DEFAULT_LANGUAGE
    }),
    MessageService,
    RageClientService,
    provideStore({
      gameInterface: gameInterfaceReducer,
      inventory: inventoryReducer,
      phone: phoneReducer
    }),
    provideEffects(),
    {
      provide: BASE_HREf,
      useValue: environment.API_BASE_HREF
    }
  ]
};
