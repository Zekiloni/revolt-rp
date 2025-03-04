import { createReducer, on } from '@ngrx/store';
import { IPhoneMessage } from '@revolt-rp/common';
import { testPhoneData } from './test-phone.data';
import { setPhone, setPhoneBackground, setPhoneMessages, setPhoneOpacity } from './phone.actions';


export interface PhoneState {
  phone: IPhoneItem | null;
  messages: IPhoneMessage[];
}

export const initialPhoneState: PhoneState = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  phone: testPhoneData,
  messages: []
};

export const phoneReducer = createReducer(
  initialPhoneState,
  on(setPhone, (state, { phone }) => {
    return { ...state, phone };
  }),
  on(setPhoneOpacity, (state, { opacity }) => {
    return { ...state, phone: { ...state.phone!, phoneInfo: { ...state.phone!.phoneInfo, opacity } } };
  }),
  on(setPhoneBackground, (state, { background }) => {
    return {
      ...state,
      phone: { ...state.phone!, phoneInfo: { ...state.phone!.phoneInfo, backgroundImage: background } }
    };
  }),
  on(setPhoneMessages, (state, { messages }) => {
    return { ...state, messages };
  })
);
