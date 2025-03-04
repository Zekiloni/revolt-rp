import { createAction, props } from '@ngrx/store';
import { IPhoneMessage } from '@revolt-rp/common';


export type PhoneAction = typeof setPhone | typeof setPhoneMessages | typeof setPhoneOpacity;

export const setPhone = createAction(
  '[Phone] Set Phone',
  props<{ phone: IPhoneItem | null }>()
);

export const setPhoneOpacity = createAction(
  '[Phone] Set Phone Opacity',
  props<{ opacity: number }>()
);

export const setPhoneBackground = createAction(
  '[Phone] Set Phone Background',
  props<{ background: string }>()
);

export const setPhoneMessages = createAction(
  '[Phone] Set Phone Messages',
  props<{ messages: IPhoneMessage[] }>()
);
