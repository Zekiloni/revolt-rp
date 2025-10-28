import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthorizationState } from './auth.state';

export const selectAuthState = createFeatureSelector<IAuthorizationState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  state => state.isAuthenticated
);

export const selectAuthToken = createSelector(
  selectAuthState,
  state => state.token
);

export const selectAccount = createSelector(
  selectAuthState,
  state => state.account
);
