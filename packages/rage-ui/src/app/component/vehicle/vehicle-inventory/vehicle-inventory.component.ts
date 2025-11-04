import { Store } from '@ngrx/store';
import { catchError, finalize, forkJoin, last, map, Observable, of } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  PickList,
  PickListModule,
  PickListMoveToSourceEvent,
  PickListMoveToTargetEvent,
  PickListSourceSelectEvent, PickListTargetSelectEvent
} from 'primeng/picklist';
import { DragDropModule } from 'primeng/dragdrop';
import { IItem, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { InventoryState } from '../../../store/inventory/inventory.reducer';
import { selectInventory } from '../../../store/inventory/inventory.selectors';
import { fadeInOutTrigger } from '../../../domain/util/animation.util';
import { getItemIcon } from '../../../domain/util/item.util';
import { StaticAssetPipe } from '@revolt-rp/common-ui';


@Component({
  selector: 'app-vehicle-inventory',
  standalone: true,
  imports: [CommonModule, PickListModule, DragDropModule, TranslatePipe, StaticAssetPipe, NgOptimizedImage],
  templateUrl: './vehicle-inventory.component.html',
  animations: [fadeInOutTrigger],
  styleUrl: './vehicle-inventory.component.css'
})
export class VehicleInventoryComponent implements OnInit, OnDestroy {
  @ViewChild('itemTrunkPickList') itemTrunkPickList!: PickList;
  protected readonly getItemIcon = getItemIcon;

  $playerInventory: Observable<IItem[]> = of([]);

  vehicleId!: number;
  $vehicleTrunk: Observable<IItem[]> = of([]);

  constructor(private rageClientService: RageClientService, private store: Store<InventoryState>) {
    this.listenToPlayerInventory();
  }

  private listenToPlayerInventory() {
    this.$playerInventory = this.store.select(selectInventory)
      .pipe(map(items => items.filter(item => item != null) as IItem[]));
  }

  private getVehicleTrunk() {
    this.$vehicleTrunk = this.rageClientService.callServer<IItem[]>(ProcedureKey.SERVER_GET_VEHICLE_TRUNK, this.vehicleId);
  }

  private setVehicleId = (id: number) => {
    this.vehicleId = id;
    this.getVehicleTrunk();
  };

  private takeItemFromTrunk(item: IItem) {
    return this.rageClientService.callServer<IItem>(ProcedureKey.SERVER_VEHICLE_TRUNK_TAKE_ITEM, [this.vehicleId, item.id]);
  }

  private putItemToTrunk(item: IItem) {
    return this.rageClientService.callServer<IItem>(ProcedureKey.SERVER_VEHICLE_TRUNK_PUT_ITEM, [this.vehicleId, item.id]);
  }

  moveToSource(event: PickListMoveToSourceEvent) {
    const transfers = event.items.map(item =>
      this.takeItemFromTrunk(item)
        .pipe(catchError(() => of(null)))
    );

    forkJoin(transfers)
      .pipe(last(), finalize(() => this.getVehicleTrunk())).subscribe();
  }

  moveToTarget(event: PickListMoveToTargetEvent) {
    const transfers = event.items.map(item =>
      this.putItemToTrunk(item)
        .pipe(catchError(() => of(null)))
    );

    forkJoin(transfers)
      .pipe(last(), finalize(() => this.getVehicleTrunk())).subscribe();
  }

  onSourceSelect(event: PickListSourceSelectEvent) {
    const [, selectedItem] = event.items;
    this.itemTrunkPickList.selectedItemsSource = [selectedItem];
  }

  onTargetSelect(event: PickListTargetSelectEvent) {
    const [, selectedItem] = event.items;
    this.itemTrunkPickList.selectedItemsTarget = [selectedItem];
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_VEHICLE, this.setVehicleId);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_VEHICLE, this.setVehicleId);
  }
}
