import { createAction, props } from '@ngrx/store';
import { IAccount } from '@revolt-rp/common';

export const loginUser = createAction(
  '[Auth] Login User',
  props<{ token: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ account: IAccount }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const logoutUser = createAction('[Auth] Logout User');

export const updateToken = createAction(
  '[Auth] Update Token',
  props<{ token: string }>()
);
