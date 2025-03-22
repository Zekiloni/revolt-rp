import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PhoneState } from './phone.reducer';


export const selectPhoneState = createFeatureSelector<PhoneState>('phone');

export const selectPhoneItem = createSelector(
  selectPhoneState,
  (state: PhoneState) => state.phone
);

export const selectPhoneMessages = createSelector(
  selectPhoneState,
  (state: PhoneState) => state.messages
);


export const selectPhoneCall = createSelector(
  selectPhoneState,
  (state: PhoneState) => state.currentCall
);
