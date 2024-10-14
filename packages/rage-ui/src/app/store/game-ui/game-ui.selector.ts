import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameInterfaceState } from './game-ui.reducer';
import { GameUiKey } from '@bc-rp-rage/shared/lib/game-ui/game-ui-key.enum';

export const selectGameInterfaceState =
  createFeatureSelector<GameInterfaceState>('gameInterface');

export const isGameInterfaceActive = (interfaceName: GameUiKey) =>
  createSelector(
    selectGameInterfaceState,
    (gameInterfaceState) => {
      return gameInterfaceState[interfaceName] ? gameInterfaceState[interfaceName].isActive : false;
    },
  );
