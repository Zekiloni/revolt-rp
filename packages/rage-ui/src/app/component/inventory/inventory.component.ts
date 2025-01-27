import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { Store } from '@ngrx/store';
import { ConfirmationService, MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { IItem, ProcedureKey } from '@revolt-rp/common';
import { getItemIcon } from '../../domain/util/item.util';
import { SplitItemComponent } from './component/split-item';
import { DraggableDirective } from '../../domain/drag-drop/draggable.directive';
import { DroppableDirective } from '../../domain/drag-drop/droppable.directive';
import { RageClientService } from '../../domain/service/rage-client.service';
import { InventoryState } from '../../store/inventory/inventory.reducer';
import { selectInventory } from '../../store/inventory/inventory.selectors';
import { GiveItemComponent, GiveItemDialogOutput } from './component/give-item';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, ContextMenuModule, BadgeModule, DraggableDirective, DroppableDirective, NgOptimizedImage, TranslatePipe, ConfirmDialogModule],
  providers: [DialogService, ConfirmationService],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  protected readonly getItemIcon = getItemIcon;

  @ViewChild('inventory') inventory!: ElementRef<HTMLElement>;
  @ViewChild('itemInfoPanel') itemInfoPanel!: OverlayPanel;
  @ViewChild('itemOptionMenu') itemOptionMenu!: ContextMenu;

  $inventory: Observable<(IItem | null)[]>;
  draggingItem: IItem | null = null;
  selectedItem: IItem | null = null;

  itemInfoKey: (keyof IItem)[] = ['serialNo', 'weaponAmmo', 'expiringAt', 'purity'];

  itemOptionMenuItems: MenuItem[] = [
    {
      label: 'split_item',
      icon: 'pi pi-arrows-h',
      command: () => this.openSplitItemMenu()
    },
    {
      label: 'drop_item',
      icon: 'pi pi-arrow-down',
      command: () => this.dropItem()
    },
    {
      label: 'give_item',
      icon: 'pi pi-share-alt',
      command: () => this.opeGiveItemMenu()
    },
    {
      label: 'destroy_item',
      icon: 'pi pi-trash',
      command: (event) => this.destroyItemConfirmation(event)
    }
  ];

  constructor(
    @Inject(Store) private store: Store<InventoryState>,
    private rageClientService: RageClientService,
    private dialogService: DialogService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService) {
    this.$inventory = this.store.select(selectInventory);
  }

  dragItemStart(item: IItem) {
    this.draggingItem = item;

    if (this.itemInfoPanel.overlayVisible) {
      this.itemInfoPanel.hide();
    }
  }

  dragItemEnd(event: DragEvent) {
    if (this.draggingItem) {
      const isOutsideInventory = this.isPointOutsideInventoryElement(event);

      if (isOutsideInventory)
        this.dropItem(this.draggingItem);

      this.draggingItem = null;
    }
  }

  dragDropItem(slot: number) {
    if (this.draggingItem) {
      this.changeSlot(this.draggingItem, slot);
      this.draggingItem = null;
    }
  }

  onContextMenu(event: MouseEvent, item: IItem) {
    this.selectedItem = item;
    this.itemInfoPanel.hide();
    this.itemOptionMenu.show(event);
  }

  showItemInfoPanel($event: MouseEvent, item: IItem) {
    if (this.itemOptionMenu.visible())
      return;

    this.selectedItem = item;

    this.itemInfoPanel.show($event);
  }

  closeItemOptionMenu() {
    this.selectedItem = null;
  }

  openSplitItemMenu = () => {
    if (!this.selectedItem) return;

    const dialogRef = this.dialogService.open(SplitItemComponent, {
      header: `Split ${this.selectedItem.name}`
    });

    dialogRef.onClose.subscribe((splitQuantity?: number) => {
      if (splitQuantity && this.selectedItem)
        this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_SPLIT_ITEM, [this.selectedItem.id, splitQuantity]);
    });

    this.selectedItem = null;
  };

  private dropItem(draggingItem?: IItem) {
    const itemToDrop = draggingItem ?? this.selectedItem;

    if (itemToDrop && itemToDrop.id)
      this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_DROP_ITEM, itemToDrop);
  }

  private changeSlot(draggingItem: IItem, slot: number) {
    if (draggingItem && draggingItem.id)
      this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_CHANGE_ITEM_SLOT, [draggingItem.id, slot]);
  }

  private isPointOutsideInventoryElement(event: DragEvent) {
    const inventoryRect = this.inventory.nativeElement.getBoundingClientRect();
    return event.clientX < inventoryRect.left ||
      event.clientX > inventoryRect.right ||
      event.clientY < inventoryRect.top ||
      event.clientY > inventoryRect.bottom;
  }

  private opeGiveItemMenu() {
    if (!this.selectedItem)
      return;

    const item = this.selectedItem;

    const dialogRef = this.dialogService.open(GiveItemComponent, {
      header: this.translateService.instant('give_item_action', { item: item.name }),
      width: '25%',
      data: item.quantity,
      closeOnEscape: true
    });

    dialogRef.onClose.subscribe((payload?: GiveItemDialogOutput) => {
      if (payload) {
        this.rageClientService.triggerServer(ProcedureKey.SERVER_P2P_GIVE_ITEM, [payload.targetId, item.id, payload.quantity]);
      }
    });
  }

  private destroyItemConfirmation = (event: MenuItemCommandEvent) => {
    if (!this.selectedItem)
      return;

    const item = this.selectedItem;

    this.confirmationService.confirm({
      target: event.originalEvent?.target as EventTarget,
      message: this.translateService.instant('destroy_item_confirmation', { item: item.name }),
      header: this.translateService.instant('destroy_item_action', { item: item.name }),
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptLabel: this.translateService.instant('yes'),
      rejectLabel: this.translateService.instant('no'),
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_DESTROY_ITEM, item.id);
      }
    });
  };
}
