import { createReducer, on } from '@ngrx/store';
import { IPhoneMessage, PhoneMessageType } from '@revolt-rp/common';
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
  messages: [
    {
      type: PhoneMessageType.Text,
      sender: testPhoneData.phoneInfo!.phoneNumber!,
      receiver: '987654321',
      content: 'Hello, this is a test message.',
      createdAt: new Date(),
      seen: false
    },
    {
      type: PhoneMessageType.Text,
      sender: testPhoneData.phoneInfo!.phoneNumber!,
      receiver: '4564565478',
      content: 'Hello, this is a test message.',
      createdAt: new Date(),
      seen: false
    },
    {
      type: PhoneMessageType.Text,
      sender: '3422432',
      receiver: testPhoneData.phoneInfo!.phoneNumber!,
      content: 'Hello, this is a test message.',
      createdAt: new Date(),
      seen: false
    }
  ]
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
