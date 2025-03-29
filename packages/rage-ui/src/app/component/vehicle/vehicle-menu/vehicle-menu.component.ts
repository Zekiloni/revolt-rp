import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameUiKey, IVehicleOption, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-vehicle-menu',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './vehicle-menu.component.html',
  styleUrl: './vehicle-menu.component.css'
})
export class VehicleMenuComponent {
  $options!: Observable<IVehicleOption[]>;

  constructor(private rageClientService: RageClientService) {
    this.$options = this.rageClientService.callServer<IVehicleOption[]>(ProcedureKey.SERVER_GET_VEHICLE_OPTIONS);
  }

  callOption(option: IVehicleOption): void {
    this.rageClientService.triggerServer(option.eventKey);
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.VehicleMenu);
  }
}
