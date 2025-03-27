import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameUiKey, IProperty, IVehicle, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Button, ButtonDirective } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslatePipe } from '@ngx-translate/core';
import { StaticAssetPipe } from '../../../../domain/pipe/static-asset.pipe';
import { DialogModule } from 'primeng/dialog';
import { VehicleStatsComponent } from '../../../vehicle/vehicle-stats';

@Component({
  selector: 'app-rent-catalog',
  standalone: true,
  imports: [CommonModule, CarouselModule, TagModule, Button, ProgressSpinnerModule, TranslatePipe, ButtonDirective, StaticAssetPipe, DialogModule, VehicleStatsComponent],
  templateUrl: './rent-catalog.component.html',
  styleUrl: './rent-catalog.component.css'
})
export class RentCatalogComponent implements OnInit, OnDestroy {
  carouselResponsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  property: Partial<IProperty> = {
    name: 'Test Property',
    vehicles: [
      {
        model: 'blista',
        rent: {
          price: 100
        }
      } as IVehicle,
      {
        model: 'elegy',
        rent: {
          price: 345
        }
      } as IVehicle,
      {
        model: 'jester',
        rent: {
          price: 67
        }
      } as IVehicle
    ]
  };

  selectedVehicle: IVehicle | null = null;
  previewVehicle = false;

  get catalog() {
    return this.property?.vehicles!.filter(vehicle => (<IVehicle>vehicle).rent) || [];
  }


  constructor(private rageClientService: RageClientService) {
  }

  private setProperty = (property: IProperty) => {
    this.property = property;
  };


  getVehicleImage(model: string) {
    return `assets/images/vehicles/${model}.png`;
  }

  isAvailable(vehicle: IVehicle) {
    return !vehicle.rent?.renter;
  }

  getAvailabilityLabel(vehicle: IVehicle) {
    return vehicle.rent?.renter ? 'not_available' : 'available';
  }

  getAvailabilitySeverity(vehicle: IVehicle) {
    return vehicle.rent?.renter ? 'danger' : 'success';
  }

  selectVehicle(vehicle: IVehicle) {
    this.selectedVehicle = vehicle;
    this.previewVehicle = true;
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.RentCatalog);
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }
}
