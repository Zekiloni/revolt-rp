import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { IVehicle } from '@revolt-rp/common';
import { RageClientService } from '../../../../../../domain/service/rage-client.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { StaticAssetPipe } from '../../../../../../domain/pipe/static-asset.pipe';

@Component({
  selector: 'app-vehicle-registration',
  imports: [CommonModule, ScrollPanelModule, Button, TranslatePipe, StaticAssetPipe],
  templateUrl: './vehicle-registration.component.html',
  styleUrl: './vehicle-registration.component.css',
})
export class VehicleRegistrationComponent {
  $vehicles: Observable<Partial<IVehicle>[]>;

  constructor(private rageClientService: RageClientService) {
    // this.$vehicles = this.rageClientService.callServer<IVehicle[]>(ProcedureKey.SERVER_GET_PLAYER_VEHICLES);
    this.$vehicles = of([
      {
        id: 'veh_001',
        model: 'zion',
        numberplate: {
          content: 'ABC123',
          modelType: 2,
          expiringAt: new Date('2025-12-31T23:59:59Z'),
          vehicleId: 'veh_001',
        }
      },
      {
        id: 'veh_001',
        model: 'zion',
        numberplate: {
          content: 'ABC123',
          modelType: 2,
          expiringAt: new Date('2025-12-31T23:59:59Z'),
          vehicleId: 'veh_001',
        }
      },
      {
        id: 'veh_001',
        model: 'zion',
        numberplate: {
          content: 'ABC123',
          modelType: 2,
          expiringAt: new Date('2025-12-31T23:59:59Z'),
          vehicleId: 'veh_001',
        }
      },
      {
        id: 'veh_001',
        model: 'zion',
      },
      {
        id: 'veh_001',
        model: 'zion',
        numberplate: {
          content: 'ABC123',
          modelType: 2,
          expiringAt: new Date('2025-12-31T23:59:59Z'),
          vehicleId: 'veh_001',
        }
      },
      {
        id: 'veh_001',
        model: 'zion',
        numberplate: {
          content: 'ABC123',
          modelType: 2,
          expiringAt: new Date('2025-12-31T23:59:59Z'),
          vehicleId: 'veh_001',
        }
      }
    ])
  }

  renew(vehicle: Partial<IVehicle>) {

  }

  register(vehicle: Partial<IVehicle>) {

  }

  getVehicleImage(model: string) {
    return `assets/images/vehicles/${model}.png`;
  }
}
