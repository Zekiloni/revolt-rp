import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { DialogService } from 'primeng/dynamicdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { IItem, ProcedureKey } from '@bcrp-rage/common';
import { SplitItemComponent } from './component/split-item';
import { DraggableDirective } from '../../domain/drag-drop/draggable.directive';
import { DroppableDirective } from '../../domain/drag-drop/droppable.directive';
import { RageClientService } from '../../domain/service/rage-client.service';
import { InventoryState } from '../../store/inventory/inventory.reducer';
import { selectInventory } from '../../store/inventory/inventory.selectors';
import { getItemIcon } from '../../domain/util/item.util';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, ContextMenuModule, BadgeModule, DraggableDirective, DroppableDirective, NgOptimizedImage],
  providers: [DialogService],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  protected readonly getItemIcon = getItemIcon;

  @ViewChild('itemInfoPanel') itemInfoPanel!: OverlayPanel;
  @ViewChild('itemOptionMenu') itemOptionMenu!: ContextMenu;

  $inventory: Observable<(IItem | null)[]>;
  draggingItem: IItem | null = null;
  selectedItem: IItem | null = null;

  lastEvent: MouseEvent | null = null;

  itemOptionMenuItems: MenuItem[] = [
    {
      label: 'Split Item',
      icon: 'pi pi-arrows-h',
      command: () => this.openSplitItemMenu()
    },
    {
      label: 'Drop Item',
      icon: 'pi pi-arrow-down'
    },
    {
      label: 'Give Item',
      icon: 'pi pi-share-alt'
    }
  ];

  constructor(
    @Inject(Store) private store: Store<InventoryState>,
    private rageClientService: RageClientService,
    private dialogService: DialogService) {
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
      this.dropItem(this.draggingItem);
      this.draggingItem = null;
      this.lastEvent = event;
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

    this.dialogService.open(SplitItemComponent, {
      header: `Split ${this.selectedItem.name}`,
      width: '300px'
    });
  };

  private dropItem(draggingItem: IItem) {
    if (draggingItem.id)
      this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_DROP_ITEM, draggingItem);

    this.draggingItem = null;
  }

  private changeSlot(draggingItem: IItem, slot: number) {
    if (draggingItem && draggingItem.id)
      this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_CHANGE_ITEM_SLOT, [draggingItem.id, slot]);
  }
}
