import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import { setAccount, unsetAccount, updateAccount } from './auth.actions';
import { IAccount } from '@revolt-rp/common';

export const authReducer = createReducer(
  initialAuthState,

  on(setAccount, (state, { account }) => ({
    ...state,
    account,
    isAuthenticated: true,
    loading: false,
  })),


  on(updateAccount, (state, { account }) => ({
    ...state,
    account: { ...state.account, ...account } as IAccount
  })),

  on(unsetAccount, _state => ({
    isAuthenticated: false,
    account: null,
  })),
);
