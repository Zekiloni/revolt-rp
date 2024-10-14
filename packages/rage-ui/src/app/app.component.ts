import { AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { on } from '@libertymp/rage-rpc';
import { GameInterfaceState } from './store/game-ui/game-ui.reducer';
import { GameUiActions, hideGameInterface, showGameInterface } from './store/game-ui/game-ui.actions';
import { isGameInterfaceActive } from './store/game-ui/game-ui.selector';
import { AuthComponent } from './component/auth';
import { CharacterSelectorComponent } from './component/character-selector';
import { GameUiKey } from '@bc-rp-rage/shared/lib/game-ui/game-ui-key.enum';
import { ProcedureKey } from '@bc-rp-rage/shared/lib/enums/procedure.enums';

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    AuthComponent,
    CharacterSelectorComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client-gui';


  interfaces = {
    'login': {
      tggle: false,
      component: AuthComponent
    }
  }

  $isGameInterfaceActive = (name: GameUiKey) => this.store.select(isGameInterfaceActive(name));

  constructor(@Inject(Store) private store: Store<GameInterfaceState>) {
  }

  ngAfterViewInit(): void {
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

  protected readonly GameUiKey = GameUiKey;
}
