import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameInterfaceState } from './game-ui.reducer';
import { GameUiKey } from '@bcrp-rage/common';

export const selectGameInterfaceState =
  createFeatureSelector<GameInterfaceState>('gameInterface');

export const isGameInterfaceActive = (interfaceName: GameUiKey) =>
  createSelector(
    selectGameInterfaceState,
    (gameInterfaceState) => {
      return gameInterfaceState[interfaceName] ? gameInterfaceState[interfaceName].isActive : false;
    },
  );
