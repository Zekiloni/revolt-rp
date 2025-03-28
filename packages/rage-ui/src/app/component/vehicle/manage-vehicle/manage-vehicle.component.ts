import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { deepCopy, GameUiKey, IVehicle, ProcedureKey } from '@revolt-rp/common';


@Component({
  selector: 'app-manage-vehicle',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslatePipe, InputTextModule, InputNumberModule, FormsModule, CheckboxModule, ButtonDirective],
  templateUrl: './manage-vehicle.component.html',
  styleUrl: './manage-vehicle.component.css'
})
export class ManageVehicleComponent implements OnInit, OnDestroy {
  @Input() isActive!: boolean;

  vehicle!: Partial<IVehicle>;
  vehicleCopy: Partial<IVehicle> | null = null;

  constructor(private rageClientService: RageClientService) {
  }

  get anyChanges(): boolean {
    return JSON.stringify(this.vehicle) !== JSON.stringify(this.vehicleCopy);
  }

  private setVehicle = (vehicle: Partial<IVehicle>) => {
    this.vehicle = vehicle;
    this.vehicleCopy = deepCopy(vehicle);
  };

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.ManageVehicle);
  }

  save() {
    console.log(this.anyChanges);
    // todo
  }

  ngOnInit() {
    this.setVehicle({
      model: 'elegy',
      fuel: 0,
      mileage: 0,
      isTemporary: false,
      locked: false,
      color: [[0, 0, 0], [0, 0, 0]],
      neonColor: 0,
      engine: false,
      mods: []
    });
    this.rageClientService.on(ProcedureKey.BROWSER_SET_VEHICLE, this.setVehicle);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_VEHICLE, this.setVehicle);
  }
}
