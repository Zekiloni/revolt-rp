import { createAction } from '@ngrx/store';
import { GameUiKey } from '@bcrp-rage/common';

export type GameUiActions = typeof showGameInterface | typeof hideGameInterface;

export const hideGameInterface = createAction('[GAME UI] Hide Game Interface', (interfaceKey: GameUiKey) => ({
  interfaceKey
}));

export const showGameInterface = createAction('[GAME UI] Show Game Interface', (interfaceKey: GameUiKey) => ({
  interfaceKey
}));

