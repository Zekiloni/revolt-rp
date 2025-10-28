import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import { loginFailure, loginSuccess, loginUser, logoutUser, updateToken } from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  on(loginUser, (state, { token }) => ({
    ...state,
    token,
    loading: true,
    error: null,
  })),

  on(loginSuccess, (state, { account }) => ({
    ...state,
    account,
    isAuthenticated: true,
    loading: false,
  })),

  on(loginFailure, (state, { error }) => ({
    ...state,
    token: null,
    account: null,
    isAuthenticated: false,
    loading: false,
    error,
  })),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on(logoutUser, _state => ({
    token: null,
    isAuthenticated: false,
    account: null,
    loading: false,
    error: null,
  })),

  on(updateToken, (state, { token }) => ({
    ...state,
    token,
  }))
);
