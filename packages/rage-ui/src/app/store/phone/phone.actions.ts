import { createAction, props } from '@ngrx/store';
import { IPhoneContact, IPhoneMessage } from '@revolt-rp/common';


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

export const addPhoneContact = createAction(
  '[Phone] Add Phone Contact',
  props<{ contact: IPhoneContact }>()
);

export const setPhoneMessages = createAction(
  '[Phone] Set Phone Messages',
  props<{ messages: IPhoneMessage[] }>()
);

export const addPhoneMessage = createAction(
  '[Phone] Add Phone Message',
  props<{ message: IPhoneMessage }>()
);


export const updatePhoneMessage = createAction(
  '[Phone] Update Phone Message',
  props<{ message: IPhoneMessage }>()
);
