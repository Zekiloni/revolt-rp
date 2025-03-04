import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PhoneState } from './phone.reducer';

export const selectPhoneState = createFeatureSelector<PhoneState>('phone');

export const selectPhone = createSelector(
  selectPhoneState,
  (state: PhoneState) => state.phone
);

export const selectPhoneMessages = createSelector(
  selectPhoneState,
  (state: PhoneState) => state.messages
);
