import { createReducer, on } from '@ngrx/store';
import { setInventory, addItem, updateItem, removeItem } from './inventory.actions';
import { IItem } from '@bcrp-rage/common';

export interface InventoryState {
  items: (IItem | null)[];
}

export const initialInventoryState: InventoryState = {
  items: Array(20).fill(null) // Initialize with 20 empty slots
};

export const inventoryReducer = createReducer(
  initialInventoryState,
  on(setInventory, (state, { items }) => {
    const updatedItems = Array(20).fill(null);
    items.forEach(item => {
      if (item.localSlot != null) {
        updatedItems[item.localSlot] = item;
      } else {
        const availableSlot = updatedItems.findIndex(a => a === null);
        if (availableSlot !== -1) {
          updatedItems[availableSlot] = item;
        }
      }
    });
    return { ...state, items: updatedItems };
  }),
  on(addItem, (state, { item }) => {
    const updatedItems = [...state.items];
    const availableSlot = updatedItems.findIndex(a => a === null);
    if (availableSlot !== -1) {
      updatedItems[availableSlot] = { ...item, localSlot: availableSlot };
    }
    return { ...state, items: updatedItems };
  }),
  on(updateItem, (state, { item }) => {
    const updatedItems = [...state.items];

    updatedItems[item.localSlot] = item;

    return { ...state, items: updatedItems };
  }),
  on(removeItem, (state, { itemId }) => {
    const updatedItems = [...state.items];
    const itemIndex = updatedItems.findIndex(existingItem => existingItem?.id === itemId);
    if (itemIndex !== -1) {
      updatedItems[itemIndex] = null;
    }
    return { ...state, items: updatedItems };
  })
);
