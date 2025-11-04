import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonDirective } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { IVehicle, IVehicleSellOffer, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { VehicleSellOfferComponent } from '../../../vehicle/vehicle-sell-offer';
import { StaticAssetPipe } from '@revolt-rp/common-ui';


declare type VehicleOwnershipType = 'vehicle_type_rented' | 'vehicle_type_owned' | 'vehicle_type_organization';


/**
 * The VehiclesOverviewComponent is responsible for displaying the overview of vehicles owned by the player.
 * It fetches the list of vehicles from the server and provides it to the template for rendering.
 * It also provides functionality to interact with the vehicles, such as spawning, selling, or returning rented vehicles.
 */
@Component({
  selector: 'app-vehicles-overview',
  standalone: true,
  imports: [CommonModule, StaticAssetPipe, TranslatePipe, ButtonDirective, Ripple, MenuModule],
  providers: [DialogService],
  templateUrl: './vehicles-overview.component.html',
  styleUrl: './vehicles-overview.component.css'
})
export class VehiclesOverviewComponent {
  $vehicles!: Observable<IVehicle[]>;
  vehicleMenuItems: MenuItem[] = [];

  /**
   * Constructor for VehiclesOverviewComponent.
   * @param rageClientService - Service to interact with the game client and server.
   * @param dialogService - Service to handle dialog interactions.
   * @param translateService - Service to handle translations.
   */
  constructor(private rageClientService: RageClientService, private dialogService: DialogService, private translateService: TranslateService) {
    this.getVehicles();
  }

  /**
   * Fetches the list of vehicles owned by the player from the server.
   * It uses the RageClientService to call the server and retrieve the data.
   */
  private getVehicles() {
    this.$vehicles = this.rageClientService.callServer<IVehicle[]>(ProcedureKey.SERVER_GET_PLAYER_VEHICLES);
  }

  /**
   * Returns the image path for a vehicle based on its model.
   * @param model
   */
  getVehicleImage(model: string) {
    return `assets/images/vehicles/${model}.png`;
  }

  isPrivateVehicle(vehicle: IVehicle): boolean {
    return vehicle.owner != undefined && vehicle.organization == undefined && !this.isRentVehicle(vehicle);
  }

  /**
   * Returns the label for the vehicle type based on its ownership status.
   * @param vehicle
   */
  getVehicleTypeLabel(vehicle: IVehicle): VehicleOwnershipType {
    switch (true) {
      case this.isRentVehicle(vehicle):
        return 'vehicle_type_rented';

      case (vehicle.organization != undefined):
        return 'vehicle_type_organization';

      default:
        return 'vehicle_type_owned';
    }
  }

  /**
   * Checks if the vehicle is a rented vehicle.
   * @param vehicle
   */
  isRentVehicle(vehicle: IVehicle): boolean {
    return vehicle.isTemporary && vehicle.rentAgencyId != undefined;
  }

  /**
   * Returns the label for the vehicle's fuel type.
   * @param color
   */
  getVehicleColorStyle(color: [number, number, number]) {
    const [r, g, b] = color;
    return `rgb(${r}, ${g}, ${b})`;
  }

  toggleVehicleOptions(vehicleOptions: Menu, event: Event, vehicle: IVehicle) {
    this.vehicleMenuItems = [];

    this.vehicleMenuItems.push({
      label: 'vehicle_menu_vehicle_info',
      icon: 'pi pi-info',
      command: () => {
        // todo
      }
    });

    if (this.isRentVehicle(vehicle)) {
      this.vehicleMenuItems.push({
        label: 'return_rent_vehicle',
        icon: 'pi pi-refresh',
        command: () => {
          this.rageClientService.triggerServer(ProcedureKey.SERVER_RETURN_RENT_VEHICLE, vehicle.id);
        }
      });
    }

    if (!vehicle.isSpawned) {
      this.vehicleMenuItems.push({
        label: 'vehicle_menu_spawn_vehicle',
        icon: 'pi pi-fw pi-car',
        command: () => {
          this.rageClientService.triggerServer(ProcedureKey.SERVER_VEHICLE_LOAD, vehicle.id);
        }
      });
    }

    if (this.isPrivateVehicle(vehicle)) {
      this.vehicleMenuItems.push({
        label: 'vehicle_sell_offer',
        icon: 'pi pi-dollar',
        command: () => {
          this.dialogService.open(VehicleSellOfferComponent, {
            header: this.translateService.instant('vehicle_sell_offer'),
            data: vehicle
          }).onClose.subscribe((offer?: IVehicleSellOffer) => {
            if (offer) {
              this.rageClientService.triggerServer(ProcedureKey.SERVER_VEHICLE_SELL_OFFER, offer);
            }
          });
        }
      });
    }

    vehicleOptions.toggle(event);
  }
}
