import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IVehicle, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';


/**
 * The VehiclesOverviewComponent is responsible for displaying the overview of vehicles owned by the player.
 * It fetches the list of vehicles from the server and provides it to the template for rendering.
 */
@Component({
  selector: 'app-vehicles-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicles-overview.component.html',
  styleUrl: './vehicles-overview.component.css',
})
export class VehiclesOverviewComponent {
  $vehicles!: Observable<IVehicle[]>;

  /**
   * Constructor for VehiclesOverviewComponent.
   * @param rageClientService - Service to interact with the game client and server.
   */
  constructor(private rageClientService: RageClientService) {
    this.getVehicles();
  }

  /**
   * Fetches the list of vehicles owned by the player from the server.
   * It uses the RageClientService to call the server and retrieve the data.
   */
  private getVehicles() {
    this.$vehicles = this.rageClientService.callServer<IVehicle[]>(ProcedureKey.SERVER_GET_PLAYER_VEHICLES);
  }
}
