import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PhoneState } from './phone.reducer';

export const selectPhoneState = createFeatureSelector<PhoneState>('phone');

export const selectPhone = createSelector(
  selectPhoneState,
  (state: PhoneState) => state.phone
);

export const selectPhoneContacts = createSelector(
  selectPhoneState,
  (state: PhoneState) => state.phone?.phoneInfo.contacts || []
);

export const selectPhoneMessages = createSelector(
  selectPhoneState,
  (state: PhoneState) => state.messages
);


export const selectPhoneCall = createSelector(
  selectPhoneState,
  (state: PhoneState) => state.currentCall
);
