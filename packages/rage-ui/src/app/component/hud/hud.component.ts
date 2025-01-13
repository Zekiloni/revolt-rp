import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { IItem, ProcedureKey } from '@revolt-rp/common';
import { DroppableDirective } from '../../domain/drag-drop/droppable.directive';
import { RageClientService } from '../../domain/service/rage-client.service';
import { selectInventory } from '../../store/inventory/inventory.selectors';
import { InventoryState } from '../../store/inventory/inventory.reducer';
import { getItemIcon } from '../../domain/util/item.util';

@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule, DroppableDirective, NgOptimizedImage],
  templateUrl: './hud.component.html',
  styleUrl: './hud.component.css'
})
export class HudComponent implements OnInit, OnDestroy {
  remoteId = 1;
  cash = 666.99;
  streetName = 'Street Name';
  zoneName = 'Zone Name';
  headingTo = 'N';
  selectedItemId: string | null = null;

  $quickSlots: Observable<(IItem | null)[]>;

  constructor(
    @Inject(Store) private store: Store<InventoryState>,
    private rageClientService: RageClientService) {
    this.$quickSlots = this.store.select(selectInventory)
      .pipe(map(inventory => inventory.slice(0, 5)));
  }


  isItemSelected(itemId: string) {
    return this.selectedItemId == itemId;
  }

  private handleSelectedItemUpdate = (value: string | null) => {
    this.selectedItemId = value;
  };

  private handleCashUpdate = (value: number) => {
    this.cash = value;
  };

  private handleUpdateLocation = (data: [string, string, string]) => {
    const [headingTo, zoneName, streetName] = data;

    this.headingTo = headingTo;
    this.zoneName = zoneName;
    this.streetName = streetName;
  };

  private handleSetPlayerRemoteId(value: number) {
    this.remoteId = value;
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_SELECTED_ITEM_ID, (value: string | null) => this.handleSelectedItemUpdate(value));
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PLAYER_REMOTE_ID, (value: number) => this.handleSetPlayerRemoteId(value));
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_CASH, (value: number) => this.handleCashUpdate(value));
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_LOCATION, (data: [string, string, string]) => this.handleUpdateLocation(data));
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_SELECTED_ITEM_ID, this.handleSelectedItemUpdate);
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_CASH, this.handleCashUpdate);
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_LOCATION, this.handleUpdateLocation);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PLAYER_REMOTE_ID, this.handleSetPlayerRemoteId);
  }

  protected readonly getItemIcon = getItemIcon;
}
