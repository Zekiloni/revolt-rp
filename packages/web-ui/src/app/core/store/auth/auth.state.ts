import { IAccount } from '@revolt-rp/common';

export interface IAuthorizationState {
  token: string | null;
  isAuthenticated: boolean;
  account: IAccount | null;
}

export const initialAuthState: IAuthorizationState = {
  token: null,
  isAuthenticated: false,
  account: null,
}
