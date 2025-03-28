import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { Button, ButtonDirective } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GameUiKey, IProduct, IProperty, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { StaticAssetPipe } from '../../../../domain/pipe/static-asset.pipe';
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

  property!: IProperty;
  selectedVehicle: IProduct | null = null;
  previewVehicle = false;

  constructor(private rageClientService: RageClientService) {
  }

  private setProperty = (property: IProperty) => {
    this.property = property;
  };


  getVehicleImage(model: string) {
    return `assets/images/vehicles/${model}.png`;
  }

  isAvailable(product: IProduct) {
    return product.stock;
  }

  getAvailabilityLabel(product: IProduct) {
    return product.stock ? 'available' : 'not_available';
  }

  getAvailabilitySeverity(product: IProduct) {
    return product.stock ? 'success' : 'danger';
  }

  selectVehicle(vehicle: IProduct) {
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
