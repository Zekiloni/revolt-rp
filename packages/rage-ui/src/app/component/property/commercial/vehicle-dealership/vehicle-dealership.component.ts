import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { CarouselModule, CarouselPageEvent } from 'primeng/carousel';
import { IDealershipCheckout, IProduct, IProperty, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { VehicleDealershipCheckoutComponent } from './components/vehicle-dealership-checkout';
import { VehicleStatsComponent } from '../../../vehicle/vehicle-stats';


@Component({
  selector: 'app-vehicle-dealership',
  standalone: true,
  imports: [CommonModule, DialogModule, Button, CarouselModule, TagModule, TranslatePipe, VehicleStatsComponent],
  providers: [DialogService],
  templateUrl: './vehicle-dealership.component.html',
  styleUrl: './vehicle-dealership.component.css'
})
export class VehicleDealershipComponent implements OnInit, OnDestroy {
  @Input() isActive!: boolean;

  showInfo = false;

  title = '';
  property!: IProperty;

  currentVehicle: IProduct | null = null;

  constructor(
    private rageClientService: RageClientService,
    private dialogService: DialogService,
    private translateService: TranslateService) {
  }

  get catalog() {
    return this.property?.catalog ?? [];
  }

  private setProperty = (property: IProperty) => {
    this.property = property;

    if (property.name)
      this.title = property.name;

    this.onCatalogPage({ page: 0 });
  };

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_DEALERSHIP_MENU, null);
  }

  onCatalogPage(event: CarouselPageEvent) {
    const page = event.page as number;
    const vehicle = this.catalog[page];

    if (vehicle) {
      this.currentVehicle = vehicle;
      const model = vehicle.name;
      this.rageClientService.triggerClient(ProcedureKey.CLIENT_PREVIEW_VEHICLE_MODEL, model);
    }
  }

  checkout() {
    this.dialogService.open(VehicleDealershipCheckoutComponent, {
      header: this.translateService.instant('vehicle_dealership_checkout', { property: this.property.name }),
      width: '40%',
    }).onClose.subscribe(((checkout?: IDealershipCheckout) => {
      if (checkout) {
        this.rageClientService.triggerClient(ProcedureKey.SERVER_VEHICLE_DEALERSHIP_BUY, checkout);
      }
    }));
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }
}
