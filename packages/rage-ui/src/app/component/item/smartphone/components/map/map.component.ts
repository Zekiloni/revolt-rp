import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldMapComponent } from '../../../../misc/world-map/world-map.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, WorldMapComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {}
