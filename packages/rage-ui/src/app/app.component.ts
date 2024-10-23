import { AsyncPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { on } from '@libertymp/rage-rpc';
import { GameInterfaceState } from './store/game-ui/game-ui.reducer';
import { GameUiActions, hideGameInterface, showGameInterface } from './store/game-ui/game-ui.actions';
import { isGameInterfaceActive } from './store/game-ui/game-ui.selector';
import { AuthorizationComponent } from './component/authorization';
import { CharacterSelectorComponent } from './component/character-selector';
import { GameUiKey, ProcedureKey } from '@bcrp-rage/common';
import { CharacterCreatorComponent } from './component/character-creator';
import { ToastModule } from 'primeng/toast';
import { TextChatComponent } from './component/text-chat';


@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    AuthorizationComponent,
    CharacterSelectorComponent,
    CharacterCreatorComponent,
    ToastModule,
    TextChatComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  protected readonly GameUiKey = GameUiKey;

  title = 'client-gui';

  $isGameInterfaceActive = (name: GameUiKey) => this.store.select(isGameInterfaceActive(name));

  constructor(@Inject(Store) private store: Store<GameInterfaceState>) {
  }

  ngOnInit(): void {
    if ('mp' in window && !window['mp'].fake) {
      const gameInterfaceEvents: Record<string, GameUiActions> = {
        [ProcedureKey.BROWSER_SHOW_GAME_INTERFACE]: showGameInterface,
        [ProcedureKey.BROWSER_HIDE_GAME_INTERFACE]: hideGameInterface
      };

      for (const eventKey in gameInterfaceEvents) {
        this.toggleGameInterface(eventKey, gameInterfaceEvents[eventKey]);
      }
    } else {
      console.warn('Unable to initialize RAGE-MP events as \'mp\' is not available in the window.');
    }
  }

  private toggleGameInterface(eventKey: string, handler: GameUiActions): void {
    on(eventKey, (gameInterfaceKey: GameUiKey) => {
      this.store.dispatch(handler(gameInterfaceKey));
    });
  }
}
