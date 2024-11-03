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
import { MessageService } from 'primeng/api';

import { gameInterfaceReducer } from './store/game-ui/game-ui.reducer';
import { inventoryReducer } from './store/inventory/inventory.reducer';
import { RageClientService } from './domain/service/rage-client.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideEffects(),
    provideStore(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimations(),
    MessageService,
    RageClientService,
    provideStore({ gameInterface: gameInterfaceReducer, inventory: inventoryReducer }),
    provideEffects(),
  ],
};
