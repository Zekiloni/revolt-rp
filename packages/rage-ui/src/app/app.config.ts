import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { gameInterfaceReducer } from './store/game-ui/game-ui.reducer';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideEffects(),
    provideStore(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimations(),
    MessageService,
    provideStore({ gameInterface: gameInterfaceReducer }),
    provideEffects(),
  ],
};
