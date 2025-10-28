import { createAction, props } from '@ngrx/store';
import { IAccount } from '@revolt-rp/common';


export const setAccount = createAction(
  '[Auth] Set Account',
  props<{ account: IAccount }>()
);

export const unsetAccount = createAction('[Auth] Logout User');

