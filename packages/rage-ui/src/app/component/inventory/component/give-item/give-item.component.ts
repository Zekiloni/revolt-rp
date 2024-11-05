import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-give-item',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule
  ],
  templateUrl: './give-item.component.html',
  styleUrl: './give-item.component.css'
})
export class GiveItemComponent {
  nearbyPlayers: { value: number, label: string }[] = [];
  selectedTarget: number | null = null;

  constructor() {
    this.nearbyPlayers.push({
      value: 1,
      label: 'Zachary Parker',
    })
  }
}
