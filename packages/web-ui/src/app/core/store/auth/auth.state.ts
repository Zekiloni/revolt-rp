import { IAccount } from '@revolt-rp/common';

export interface IAuthorizationState {
  isAuthenticated: boolean;
  account: IAccount | null;
}

export const initialAuthState: IAuthorizationState = {
  account: null,
  isAuthenticated: false,
}
