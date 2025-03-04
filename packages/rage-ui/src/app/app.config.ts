import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MessageService } from 'primeng/api';

import { gameInterfaceReducer } from './store/game-ui/game-ui.reducer';
import { inventoryReducer } from './store/inventory/inventory.reducer';
import { RageClientService } from './domain/service/rage-client.service';
import { provideTranslateService } from '@ngx-translate/core';
import { BASE_HREf } from './domain/variables';
import { environment } from '../environments/environment';
import { phoneReducer } from './store/phone/phone.reducer';


export const appConfig: ApplicationConfig = {
  providers: [
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideEffects(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimations(),
    provideTranslateService({
      defaultLanguage: 'en-US'
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
