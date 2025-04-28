import { AsyncPipe } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastModule } from 'primeng/toast';
import { Message, MessageService } from 'primeng/api';
import {
  enUs,
  GameUiKey,
  ICommandBase,
  ProcedureKey,
  srRs
} from '@revolt-rp/common';
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
import { ManageOrganizationComponent } from './component/organization/manage-organization';
import { HandheldRadioComponent } from './component/item/handheld-radio/handheld-radio.component';
import { CreatePropertyComponent } from './component/property/create-property';
import { ManagePropertyComponent } from './component/property/manage-property';
import { PropertyInfoComponent } from './component/property/property-info';
import { DmvMenuComponent } from './component/property/public-service';
import { SmartphoneComponent } from './component/item/smartphone';
import { BanInfoComponent } from './component/ban-info';
import { HelpComponent } from './component/help';
import { dayjs } from './domain/util/dajys.util';
import { VehicleInventoryComponent } from './component/vehicle/vehicle-inventory';
import { RentCatalogComponent } from './component/property/commercial/rent-catalog';
import { ManageVehicleComponent } from './component/vehicle/manage-vehicle';
import { VehicleMenuComponent } from './component/vehicle/vehicle-menu';
import { GroceryStoreComponent } from './component/property/commercial/grocery-store';
import { ClothingStoreComponent } from './component/property/commercial/clothing-store';
import { VehicleDealershipComponent } from './component/property/commercial/vehicle-dealership';


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
    CreateOrganizationComponent,
    ManageOrganizationComponent,
    HandheldRadioComponent,
    BanInfoComponent,
    CreatePropertyComponent,
    PropertyInfoComponent,
    ManagePropertyComponent,
    SmartphoneComponent,
    HelpComponent,
    DmvMenuComponent,
    VehicleInventoryComponent,
    RentCatalogComponent,
    ManageVehicleComponent,
    VehicleMenuComponent,
    GroceryStoreComponent,
    ClothingStoreComponent,
    VehicleDealershipComponent
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
  private renderer?: Renderer2;

  commands: ICommandBase[] = [];

  $isGameInterfaceActive = (name: GameUiKey) => this.store.select(isGameInterfaceActive(name));

  constructor(
    private translateService: TranslateService,
    private rageClientService: RageClientService,
    @Inject(Store) private store: Store<GameInterfaceState>,
    private inventoryListenerService: InventoryListenerService,
    private rendererFactory: RendererFactory2,
    private messageService: MessageService
  ) {
    this.initializeLanguages();
  }

  private initializeLanguages() {
    this.translateService.setTranslation('en-US', enUs);
    this.translateService.setTranslation('sr-RS', srRs);
    this.translateService.setDefaultLang(environment.DEFAULT_LANGUAGE);

    dayjs.locale(this.translateService.currentLang || this.translateService.defaultLang);
    this.translateService.onLangChange.subscribe(() => {
      dayjs.locale(this.translateService.currentLang);
    });
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

  listenToInputs() {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    this.renderer.listen('document', 'focusin', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        this.rageClientService.invoke('setTypingInChatState', true);
      }
    });

    this.renderer.listen('document', 'focusout', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        this.rageClientService.invoke('setTypingInChatState', false);
      }
    });
  }

  private getAllCommands() {
    this.rageClientService.callServer<ICommandBase[]>(ProcedureKey.SERVER_GET_COMMANDS)
      .subscribe(commands => {
        this.commands = Array.from(new Set(commands));
      });
  }

  ngOnInit(): void {
    if ('mp' in window && !window['mp'].fake) {
      this.listenToToggleGameInterfaceEvents();
      this.listenToNotificationEvents();
      this.listenToInputs();
      this.getAllCommands();
      this.inventoryListenerService.listenToInventoryEvents();
    } else {
      console.warn('Unable to initialize RAGE-MP events as \'mp\' is not available in the window.');
    }
  }
}
