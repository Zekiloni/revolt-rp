import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IItem, characterConfig } from '@bcrp-rage/common';
import { DragDropModule } from 'primeng/dragdrop';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, DragDropModule, OverlayPanelModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  @ViewChild('itemInfoPanel', { static: false }) itemInfoPanel!: OverlayPanel;

  inventory: (IItem | null)[] = Array(characterConfig.maxInventoryItems).fill(null);
  draggingItem: IItem | null = null;

  ngOnInit(): void {
    const items: Partial<IItem>[] = [
      {
        name: 'test',
        localSlot: 3
      },
      {
        name: 'test',
        localSlot: 7
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

  dragItemEnd() {
    this.draggingItem = null;
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
    }
  }


}
