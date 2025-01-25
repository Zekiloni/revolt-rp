import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ProcedureKey, IVehicleHudUpdate } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';

@Component({
  selector: 'app-vehicle-hud',
  standalone: true,
  imports: [CommonModule, KnobModule, FormsModule, PrimeTemplate, FileUploadModule],
  templateUrl: './vehicle-hud.component.html',
  styleUrl: './vehicle-hud.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleHudComponent implements OnInit, OnDestroy {
  maxSpeed = 250;
  speed = 0;
  fuel = 11;
  rpm = 0;
  mileage = 0.0;
  gear = 0;
  lights: 'off' | 'on' | 'highbeams' = 'off';
  cruiseControl = false;
  indicators: boolean[] = [false, false];

  constructor(private rageClientService: RageClientService, private cdr: ChangeDetectorRef) {
  }

  get speedValueColor() {
    if (this.speed <= 70) {
      return 'White';
    } else if (this.speed > 70 && this.speed <= 150) {
      return 'Khaki';
    } else {
      return 'Crimson';
    }
  }

  updateInfo = (data: IVehicleHudUpdate) => {
    this.speed = data.speed;
    this.gear = data.gear;
    this.fuel = data.fuel;
    this.rpm = data.rpm;
    this.mileage = data.mileage;
    this.lights = data.lightsOn && data.highBeamsOn
      ? 'highbeams'
      : data.lightsOn
        ? 'on'
        : 'off';

    this.cdr.detectChanges()
  };

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_VEHICLE_HUD, this.updateInfo);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_VEHICLE_HUD, this.updateInfo);

  }
}
