import { Component, Inject, OnDestroy, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastModule } from 'primeng/toast';
import {  MessageService } from 'primeng/api';
import {
  enUs,
  GameUiKey,
  ProcedureKey,
  srRs
} from '@revolt-rp/common';
import { GameUiActions, hideGameInterface, showGameInterface } from './store/game-ui/game-ui.actions';
import { InventoryListenerService } from './domain/service/inventory-listener.service';
import { RageClientService } from './domain/service/rage-client.service';
import { GameInterfaceState } from './store/game-ui/game-ui.reducer';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { fadeInOutTrigger } from './domain/util/animation.util';
import { dayjs } from './domain/util/dajys.util';
import { ToastMessageOptions } from 'primeng/api/toastmessage';
import { PrimeNG } from 'primeng/config';
import { ColorConverterService } from './domain/service/color-converter.service';
import { RouterOutlet } from '@angular/router';


@Component({
  standalone: true,
  imports: [
    ToastModule,
    RouterOutlet
  ],
  providers: [InventoryListenerService],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    fadeInOutTrigger
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  protected readonly GameUiKey = GameUiKey;
  private renderer?: Renderer2;


  constructor(
    private config: PrimeNG,
    private translateService: TranslateService,
    private rageClientService: RageClientService,
    @Inject(Store) private store: Store<GameInterfaceState>,
    private inventoryListenerService: InventoryListenerService,
    private rendererFactory: RendererFactory2,
    private messageService: MessageService,
    private colorConverter: ColorConverterService
  ) {
    this.initializeLanguages();
  }

  private initializeLanguages() {
    this.translateService.setTranslation('en-US', enUs);
    this.translateService.setTranslation('sr-RS', srRs);
    this.translateService.setDefaultLang(environment.DEFAULT_LANGUAGE);
    this.translateService.get('primeng').subscribe(value => this.config.setTranslation(value));

    dayjs.locale(this.translateService.currentLang || this.translateService.defaultLang);

    this.translateService.onLangChange.subscribe(() => {
      dayjs.locale(this.translateService.currentLang);
      this.translateService.get('primeng').subscribe(value => this.config.setTranslation(value));
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

  ngOnInit(): void {
    this.colorConverter.initialize();
    if ('mp' in window && !window['mp'].fake) {
      this.listenToToggleGameInterfaceEvents();
      this.listenToInputs();
      this.inventoryListenerService.listenToInventoryEvents();
    } else {
      console.warn('Unable to initialize RAGE-MP events as \'mp\' is not available in the window.');
    }
  }

  ngOnDestroy() {
    this.colorConverter.destroy();
  }
}
