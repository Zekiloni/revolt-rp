import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { ProcedureKey, IVehicleHudUpdate } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { VehicleXmrComponent } from '../vehicle-xmr';

@Component({
  selector: 'app-vehicle-hud',
  standalone: true,
  imports: [CommonModule, KnobModule, FormsModule, VehicleXmrComponent],
  templateUrl: './vehicle-hud.component.html',
  styleUrl: './vehicle-hud.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleHudComponent implements OnInit, OnDestroy {
  protected readonly Math = Math;

  private rageClientService = inject(RageClientService);
  private cdr = inject(ChangeDetectorRef);

  type: 'fly' | 'ground' | 'water' = 'ground';
  maxSpeed = 250;
  speed = 0;
  fuel = 11;
  rpm = 0;
  mileage = 0.0;
  gear = 0;
  lights: 'off' | 'on' | 'highbeams' = 'off';
  height = 0;
  pitch = 0;
  roll = 0;
  cruiseControl = false;
  indicators: boolean[] = [false, false];

  updateInfo = (data: IVehicleHudUpdate) => {
    if (data.type !== this.type) {
      this.type = data.type;
    }

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

    this.pitch = -data.pitch;
    this.roll = -data.roll;
    this.height = data.height

    this.cdr.detectChanges()
  };


  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_VEHICLE_HUD, this.updateInfo);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_VEHICLE_HUD, this.updateInfo);
  }
}
