import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { DialogService } from 'primeng/dynamicdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { IItem, characterConfig, ProcedureKey } from '@bcrp-rage/common';
import { SplitItemComponent } from './component/split-item';
import { DraggableDirective } from '../../domain/drag-drop/draggable.directive';
import { DroppableDirective } from '../../domain/drag-drop/droppable.directive';
import { RageClientService } from '../../domain/service/rage-client.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, ContextMenuModule, BadgeModule, DraggableDirective, DroppableDirective],
  providers: [DialogService],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  @ViewChild('itemInfoPanel') itemInfoPanel!: OverlayPanel;
  @ViewChild('itemOptionMenu') itemOptionMenu!: ContextMenu;

  inventory: (IItem | null)[] = Array(characterConfig.maxInventoryItems).fill(null);
  draggingItem: IItem | null = null;
  selectedItem: IItem | null = null;

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
    private rageClientService: RageClientService,
    private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.rageClientService.callServer<IItem[]>(ProcedureKey.SERVER_PLAYER_GET_INVENTORY)
      .subscribe({ next: (items) => this.handleGetInventory(items) });
  }

  private handleGetInventory(items: IItem[]) {
    items.forEach(item => {
      if (item.localSlot) {
        this.inventory[(item.localSlot)] = item;
      } else {
        const availableSlot = this.inventory.findIndex(a => a == null);

        if (availableSlot != -1) {
          this.inventory[availableSlot] = item;
        }
      }
    });
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
    }
  }

  dragDropItem(slot: number) {
    console.log(slot);
    if (this.draggingItem) {
      if (this.inventory[slot]) {
        const currentItem = this.inventory[slot];

      } else {
        console.log('aa');
        // call server slot change
        delete this.inventory[this.draggingItem.localSlot!];
        this.draggingItem!.localSlot = slot;
        this.inventory[slot] = this.draggingItem;
      }

      this.draggingItem = null;
    }
  }

  onContextMenu(event: MouseEvent, item: IItem) {
    this.selectedItem = item;
    this.itemInfoPanel.hide();
    this.itemOptionMenu.show(event);
  }

  showItemInfoPanel($event: MouseEvent) {
    if (this.itemOptionMenu.visible())
      return;

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
    this.rageClientService.callClient<true | undefined>(ProcedureKey.CLIENT_PLAYER_DROP_ITEM, draggingItem)
      .subscribe({
        next: (response?: true) => {
          if (response) {
            const idx = this.inventory.indexOf(draggingItem);
            if (idx != -1) {
              this.inventory[idx] = null;
            }
          }
        }
      });
  }
}
