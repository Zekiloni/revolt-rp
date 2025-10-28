import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import { setAccount, unsetAccount } from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  on(setAccount, (state, { account }) => ({
    ...state,
    account,
    isAuthenticated: true,
    loading: false,
  })),


  on(unsetAccount, _state => ({
    isAuthenticated: false,
    account: null,
  })),
);
