import { BehaviorSubject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { IVehicleHudUpdate, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';


@Injectable({ providedIn: 'root' }) // ensure singleton
export class VehicleHudService implements OnDestroy {
  private hudStateSubject = new BehaviorSubject<IVehicleHudUpdate | null>(null);
  hudState$ = this.hudStateSubject.asObservable();

  constructor(private rageClientService: RageClientService) {
    this.listenToVehicleUpdate();
  }

  private updateInfo = (data: IVehicleHudUpdate) => {
    this.hudStateSubject.next(data);
  };

  private listenToVehicleUpdate() {
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_VEHICLE_HUD, this.updateInfo);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_VEHICLE_HUD, this.updateInfo);
  }
}
