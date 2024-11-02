import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProcedureKey } from '@bcrp-rage/common';
import { RageClientService } from './rage-client.service';
import {
  addItem,
  InventoryActions,
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
    const inventoryEvents: Record<string, InventoryActions> = {
      [ProcedureKey.BROWSER_SET_INVENTORY]: setInventory,
      [ProcedureKey.BROWSER_INVENTORY_ADD_ITEM]: addItem,
      [ProcedureKey.BROWSER_INVENTORY_UPDATE_ITEM]: updateItem,
      [ProcedureKey.BROWSER_INVENTORY_REMOVE_ITEM]: removeItem
    };

    for (const eventKey in inventoryEvents) {
      this.rageClientService.on(eventKey, (payload: NonNullable<any>) => {
        this.store.dispatch(inventoryEvents[eventKey](payload));
      });
    }
  }
}
