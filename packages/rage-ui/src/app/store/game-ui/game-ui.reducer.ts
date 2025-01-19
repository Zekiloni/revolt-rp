import { createReducer, on } from '@ngrx/store';
import { hideGameInterface, showGameInterface } from './game-ui.actions';
import { GameInterface, gameUiConfig, GameUiKey } from '@revolt-rp/common';


export type GameInterfaceState = Record<GameUiKey, GameInterface>;

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
