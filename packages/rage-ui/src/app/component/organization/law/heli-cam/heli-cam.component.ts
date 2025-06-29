import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IVehicleHudUpdate } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { VehicleHudService } from '../../../vehicle/vehicle-hud/vehicle-hud.service';

@Component({
  selector: 'app-heli-cam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heli-cam.component.html',
  styleUrl: './heli-cam.component.css'
})
export class HeliCamComponent implements OnInit, OnDestroy {
  hudState$: Observable<IVehicleHudUpdate | null>;

  constructor(private rageClientService: RageClientService, private vehicleHudService: VehicleHudService) {
    this.hudState$ = this.vehicleHudService.hudState$;
  }

  ngOnInit(): void {
    this.rageClientService.on('', () => console.log('HeliCamComponent initialized'));
  }

  ngOnDestroy(): void {
    this.rageClientService.off('', () => console.log('HeliCamComponent destroyed'));
  }
}
