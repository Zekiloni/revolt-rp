import { createReducer, on } from '@ngrx/store';
import { hideGameInterface, showGameInterface } from './game-ui.actions';
import { IGameInterface } from '@bc-rp-rage/shared/lib/game-ui/game-ui.model';
import { GameUiKey } from '@bc-rp-rage/shared/lib/game-ui/game-ui-key.enum';
import { gameUiConfig } from '@bc-rp-rage/shared/lib/game-ui/game-ui.config';


export type GameInterfaceState = Record<GameUiKey, IGameInterface>;

const initialState: GameInterfaceState = gameUiConfig;

export const gameInterfaceReducer = createReducer(
  initialState,
  on(showGameInterface, (state, { interfaceKey }) => ({
    ...state,
    [interfaceKey]: { ...state[interfaceKey], isActive: true },
  })),
  on(hideGameInterface, (state, { interfaceKey }) => ({
    ...state,
    [interfaceKey]: { ...state[interfaceKey], isActive: false },
  })),
);
