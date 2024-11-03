import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IItem, ProcedureKey } from '@bcrp-rage/common';
import { RageClientService } from './rage-client.service';
import {
  addItem,
  removeItem,
  setInventory,
  updateItem
} from '../../store/inventory/inventory.actions';
import { InventoryState } from '../../store/inventory/inventory.reducer';


@Injectable()
export class InventoryListenerService {

  constructor(
    private rageClientService: RageClientService,
    @Inject(Store) private store: Store<InventoryState>
  ) {
  }

  listenToInventoryEvents() {
    const inventoryEvents = {
      [ProcedureKey.BROWSER_SET_INVENTORY]: (items: IItem[]) => this.store.dispatch(setInventory({ items })),
      [ProcedureKey.BROWSER_INVENTORY_ADD_ITEM]: (item: IItem) => this.store.dispatch(addItem({ item })),
      [ProcedureKey.BROWSER_INVENTORY_UPDATE_ITEM]: (item: IItem) => this.store.dispatch(updateItem({ item })),
      [ProcedureKey.BROWSER_INVENTORY_REMOVE_ITEM]: (itemId: string) => this.store.dispatch(removeItem({ itemId }))
    };

    for (const [eventKey, handler] of Object.entries(inventoryEvents)) {
      this.rageClientService.on(eventKey, (payload: NonNullable<any>) => handler(payload));
    }
  }
}
