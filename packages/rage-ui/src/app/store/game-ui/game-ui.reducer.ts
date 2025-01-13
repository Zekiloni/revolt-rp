import { createReducer, on } from '@ngrx/store';
import { hideGameInterface, showGameInterface } from './game-ui.actions';
import { gameUiConfig, GameUiKey, GameInterface } from '@revolt-rp/common';


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
