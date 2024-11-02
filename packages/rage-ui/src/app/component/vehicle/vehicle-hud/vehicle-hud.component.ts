import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-vehicle-hud',
  standalone: true,
  imports: [CommonModule, KnobModule, FormsModule, PrimeTemplate, FileUploadModule],
  templateUrl: './vehicle-hud.component.html',
  styleUrl: './vehicle-hud.component.css',
})
export class VehicleHudComponent {
  maxSpeed = 250;
  speed = 140;
  fuel = 11
  rpm = 0
  mileage = 0.0
  gear = 'N'
  lights: 'off' | 'on' | 'highbeams' = 'off'
  cruiseControl = false
  indicators: boolean[] = [false, false]

  get speedValueColor() {
    if (this.speed <= 70) {
      return 'White';
    } else if (this.speed > 70 && this.speed <= 150) {
      return 'Khaki';
    } else {
      return 'Crimson';
    }
  }
}
