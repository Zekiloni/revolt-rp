import { createReducer, on } from '@ngrx/store';
import { IPhoneCall, IPhoneMessage } from '@revolt-rp/common';
import {
  addPhoneContact,
  addPhoneMessage,
  deletePhoneContact,
  setPhone,
  setPhoneBackground,
  setPhoneCall,
  setPhoneMessages,
  setPhoneOpacity, updateManyPhoneMessages, updatePhoneContact,
  updatePhoneMessage
} from './phone.actions';
import { testMessages, testPhoneData } from './test-phone.data';


export interface PhoneState {
  phone: IPhoneItem | null;
  messages: IPhoneMessage[];
  currentCall: IPhoneCall | null;
  phoneCalls: IPhoneCall[];
}

export const initialPhoneState: PhoneState = {
  phone: null,
  messages: [],
  currentCall: null,
  phoneCalls: []
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
  on(addPhoneContact, (state, { contact }) => {
    return {
      ...state,
      phone: {
        ...state.phone!,
        phoneInfo: { ...state.phone!.phoneInfo, contacts: [...state.phone!.phoneInfo.contacts, contact] }
      }
    };
  }),

  on(deletePhoneContact, (state, { contactId }) => {
    return {
      ...state,
      phone: {
        ...state.phone!,
        phoneInfo: {
          ...state.phone!.phoneInfo,
          contacts: state.phone!.phoneInfo.contacts.filter(c => c.id !== contactId)
        }
      }
    };
  }),
  on(updatePhoneContact, (state, { contact }) => {
    return {
      ...state,
      phone: {
        ...state.phone!,
        phoneInfo: {
          ...state.phone!.phoneInfo,
          contacts: state.phone!.phoneInfo.contacts.map(c => c.id === contact.id ? contact : c)
        }
      }
    };
  }),
  on(setPhoneCall, (state, { currentCall }) => {
    return { ...state, currentCall: currentCall };
  }),
  on(setPhoneMessages, (state, { messages }) => {
    return { ...state, messages };
  }),
  on(addPhoneMessage, (state, { message }) => {
    if (state.phone?.phoneInfo?.phoneNumber === message.sender || state.phone?.phoneInfo?.phoneNumber === message.receiver) {
      return { ...state, messages: [...state.messages, message] };
    }

    return { ...state };
  }),
  on(updatePhoneMessage, (state, { message }) => {
    const messages = state.messages.map(m => m.id === message.id ? message : m);
    return { ...state, messages };
  }),
  on(updateManyPhoneMessages, (state, { messages }) => {
    const messageMap = new Map(messages.map(msg => [msg.id, msg]));
    console.log('messagesMap', messageMap);
    const updatedMessages = state.messages.map(m => messageMap.has(m.id) ? messageMap.get(m.id)! : m);
    console.log('updatedMessages ', JSON.stringify(updatedMessages));

    return { ...state, messages: updatedMessages };
  })
);
