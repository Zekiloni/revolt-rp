import { createAction, props } from '@ngrx/store';
import { IItem } from '@bcrp-rage/common';

export const setInventory = createAction(
  '[Inventory] Set Inventory',
  props<{ items: IItem[] }>()
);

export const addItem = createAction(
  '[Inventory] Add Item',
  props<{ item: IItem }>()
);

export const updateItem = createAction(
  '[Inventory] Update Item',
  props<{ item: IItem }>()
);

export const removeItem = createAction(
  '[Inventory] Remove Item',
  props<{ itemId: string }>()
);
