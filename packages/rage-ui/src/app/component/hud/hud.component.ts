import { Store } from '@ngrx/store';
import { BehaviorSubject, map, Observable, Subject, takeUntil, timer } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { IItem, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../domain/service/rage-client.service';
import { selectInventory } from '../../store/inventory/inventory.selectors';
import { InventoryState } from '../../store/inventory/inventory.reducer';
import { getItemIcon } from '../../domain/util/item.util';
import { StaticAssetPipe } from '../../domain/pipe/static-asset.pipe';
import { fadeInOutTrigger } from '../../domain/util/animation.util';

const SHOW_HIDE_TIMEOUT = 3000;

@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, StaticAssetPipe],
  templateUrl: './hud.component.html',
  styleUrl: './hud.component.css',
  animations: [fadeInOutTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HudComponent implements OnInit, OnDestroy {
  protected readonly getItemIcon = getItemIcon;

  remoteId = 1;
  cash = 666.99;
  streetName = 'Street Name';
  zoneName = 'Zone Name';
  headingTo = 'N';

  speedLimit: number | null = null;

  selectedItemId: string | null = null;

  $quickSlots: Observable<(IItem | null)[]>;

  private showQuickSlotsSubject = new BehaviorSubject<boolean>(false);
  $showQuickSlots = this.showQuickSlotsSubject.asObservable();

  private $destroy = new Subject<void>();

  constructor(
    @Inject(Store) private store: Store<InventoryState>,
    private rageClientService: RageClientService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.$quickSlots = this.store.select(selectInventory)
      .pipe(map(inventory => inventory.slice(0, 5)));
  }

  private triggerQuickSlotsVisibility() {
    if (this.showQuickSlotsSubject.value)
      return

    this.showQuickSlotsSubject.next(true);

    timer(SHOW_HIDE_TIMEOUT)
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.showQuickSlotsSubject.next(false);
        this.changeDetectorRef.detectChanges();
      });
  }

  private handleSelectedItemUpdate = (value: string | null) => {
    this.selectedItemId = value;
    this.triggerQuickSlotsVisibility();
  };

  private handleCashUpdate = (value: number) => {
    this.cash = value;
    this.changeDetectorRef.detectChanges();
  };

  private handleUpdateLocation = (data: [string, string, string]) => {
    const [headingTo, zoneName, streetName] = data;

    this.headingTo = headingTo;
    this.zoneName = zoneName;
    this.streetName = streetName;
    this.changeDetectorRef.detectChanges();
  };

  private handleSetPlayerRemoteId = (value: number) => {
    this.remoteId = value;
    this.changeDetectorRef.detectChanges();
  };

  private handleSetSpeedLimit = (value: number | null) => {
    this.speedLimit = value;
  };

  isItemSelected(itemId: string) {
    return this.selectedItemId == itemId;
  }

  getSpeedLimitImage() {
    return `assets/images/road_sign/${this.speedLimit}.png`;
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_CASH, this.handleCashUpdate);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_SPEED_LIMIT, this.handleSetSpeedLimit);
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_LOCATION, this.handleUpdateLocation);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PLAYER_REMOTE_ID, this.handleSetPlayerRemoteId);
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_SELECTED_ITEM_ID, this.handleSelectedItemUpdate);

    this.$quickSlots
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.triggerQuickSlotsVisibility();
      });
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_CASH, this.handleCashUpdate);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_SPEED_LIMIT, this.handleSetSpeedLimit);
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_LOCATION, this.handleUpdateLocation);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PLAYER_REMOTE_ID, this.handleSetPlayerRemoteId);
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_SELECTED_ITEM_ID, this.handleSelectedItemUpdate);

    this.$destroy.next();
    this.$destroy.complete();
  }
}
