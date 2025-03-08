import { createReducer, on } from '@ngrx/store';
import { IPhoneMessage } from '@revolt-rp/common';
import { addPhoneMessage, setPhone, setPhoneBackground, setPhoneMessages, setPhoneOpacity } from './phone.actions';
import { testMessages, testPhoneData } from './test-phone.data';


export interface PhoneState {
  phone: IPhoneItem | null;
  messages: IPhoneMessage[];
}

export const initialPhoneState: PhoneState = {
  phone: testPhoneData as IPhoneItem,
  messages: testMessages
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
  }),
  on(addPhoneMessage, (state, { message }) => {
    if (state.phone?.phoneInfo?.phoneNumber === message.sender || state.phone?.phoneInfo?.phoneNumber === message.receiver) {
      return { ...state, messages: [...state.messages, message] };
    }

    return { ...state };
  })
);
