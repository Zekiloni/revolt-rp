import { AsyncPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastModule } from 'primeng/toast';
import { Message, MessageService } from 'primeng/api';
import { srRs, enUs, GameUiKey, ProcedureKey } from '@revolt-rp/common';
import { GameUiActions, hideGameInterface, showGameInterface } from './store/game-ui/game-ui.actions';
import { InventoryListenerService } from './domain/service/inventory-listener.service';
import { CharacterSelectorComponent } from './component/character-selector';
import { CharacterCreatorComponent } from './component/character-creator';
import { RageClientService } from './domain/service/rage-client.service';
import { isGameInterfaceActive } from './store/game-ui/game-ui.selector';
import { VehicleHudComponent } from './component/vehicle/vehicle-hud';
import { GameInterfaceState } from './store/game-ui/game-ui.reducer';
import { AuthorizationComponent } from './component/authorization';
import { TextChatComponent } from './component/text-chat';
import { InventoryComponent } from './component/inventory';
import { HudComponent } from './component/hud';
import { PlayerMenuComponent } from './component/player-menu';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { PlayerOfferComponent } from './component/player-offer';
import { fadeInOutTrigger } from './domain/util/animation.util';
import { BankMenuComponent } from './component/banking/bank-menu';
import { BankAtmComponent } from './component/banking/bank-atm';
import { AnimationMenuComponent } from './component/emote/animation-menu';
import { DeathScreenComponent } from './component/death-screen';
import { PlayerDamageInfoComponent } from './component/player-damage-info';
import { CreateOrganizationComponent } from './component/organization/create-organization';


@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    AuthorizationComponent,
    CharacterSelectorComponent,
    CharacterCreatorComponent,
    ToastModule,
    TextChatComponent,
    InventoryComponent,
    HudComponent,
    VehicleHudComponent,
    PlayerMenuComponent,
    PlayerOfferComponent,
    BankMenuComponent,
    BankAtmComponent,
    AnimationMenuComponent,
    DeathScreenComponent,
    PlayerDamageInfoComponent,
    CreateOrganizationComponent
  ],
  providers: [InventoryListenerService],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    fadeInOutTrigger
  ]
})
export class AppComponent implements OnInit {
  protected readonly GameUiKey = GameUiKey;

  title = 'client-gui';

  $isGameInterfaceActive = (name: GameUiKey) => this.store.select(isGameInterfaceActive(name));

  constructor(
    private translateService: TranslateService,
    private rageClientService: RageClientService,
    @Inject(Store) private store: Store<GameInterfaceState>,
    private inventoryListenerService: InventoryListenerService,
    private messageService: MessageService) {

    this.initializeLanguages();
  }

  private initializeLanguages() {
    this.translateService.setTranslation('en-US', enUs);
    this.translateService.setTranslation('sr-RS', srRs);
    this.translateService.setDefaultLang(environment.DEFAULT_LANGUAGE);
  }

  ngOnInit(): void {
    if ('mp' in window && !window['mp'].fake) {
      this.listenToToggleGameInterfaceEvents();
      this.listenToNotificationEvents();
      this.inventoryListenerService.listenToInventoryEvents();
    } else {
      console.warn('Unable to initialize RAGE-MP events as \'mp\' is not available in the window.');
    }
  }

  private listenToToggleGameInterfaceEvents() {
    const gameInterfaceEvents: Record<string, GameUiActions> = {
      [ProcedureKey.BROWSER_SHOW_GAME_INTERFACE]: showGameInterface,
      [ProcedureKey.BROWSER_HIDE_GAME_INTERFACE]: hideGameInterface
    };

    for (const eventKey in gameInterfaceEvents) {
      this.toggleGameInterface(eventKey, gameInterfaceEvents[eventKey]);
    }
  }

  private toggleGameInterface(eventKey: string, handler: GameUiActions): void {
    this.rageClientService.on(eventKey, (gameInterfaceKey: GameUiKey) => {
      this.store.dispatch(handler(gameInterfaceKey));
    });
  }

  private listenToNotificationEvents() {
    this.rageClientService.on(ProcedureKey.BROWSER_NOTIFICATION, (message: Message) => {
      this.messageService.add(message);
    });
  }
}
