import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { DragDropModule } from 'primeng/dragdrop';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { IItem, characterConfig } from '@bcrp-rage/common';
import { DialogService } from 'primeng/dynamicdialog';
import { SplitItemComponent } from './component/split-item';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, DragDropModule, OverlayPanelModule, ContextMenuModule, BadgeModule],
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

  constructor(private dialogService: DialogService) {
  }

  ngOnInit(): void {
    const items: Partial<IItem>[] = [
      {
        name: 'test',
        localSlot: 3,
        quantity: 3
      },
      {
        name: 'test',
        localSlot: 7,
        quantity: 1
      }
    ];

    items.forEach(item => {
      if (item.localSlot) {
        this.inventory[(item.localSlot)] = item as IItem;
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
    const idx = this.inventory.indexOf(draggingItem);
    if (idx != -1) {
      this.inventory[idx] = null;
    }
  }
}
