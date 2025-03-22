import { createAction, props } from '@ngrx/store';
import { IPhoneCall, IPhoneContact, IPhoneMessage, IPhonePhoto } from '@revolt-rp/common';


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


export const setPhoneCall = createAction(
  '[Phone] Set Phone Call',
  props<{ currentCall: IPhoneCall | null }>()
);

export const addPhoneContact = createAction(
  '[Phone] Add Phone Contact',
  props<{ contact: IPhoneContact }>()
);

export const deletePhoneContact = createAction(
  '[Phone] Delete Phone Contact',
  props<{ contactId: string }>()
);

export const updatePhoneContact = createAction(
  '[Phone] Update Phone Contact',
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


export const addPhonePhoto = createAction(
  '[Phone] Add Phone Photo',
  props<{ photo: IPhonePhoto }>()
);

export const removePhonePhoto = createAction(
  '[Phone] Remove Phone Photo',
  props<{ photoId: string }>()
);

export const updatePhoneMessage = createAction(
  '[Phone] Update Phone Message',
  props<{ message: IPhoneMessage }>()
);

export const updateManyPhoneMessages = createAction(
  '[Phone] Update Many Phone Messages',
  props<{ messages: IPhoneMessage[] }>()
);

