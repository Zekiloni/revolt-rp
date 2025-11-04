import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { Button, ButtonDirective } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GameUiKey, IPayment, IProduct, IProperty, IVehicleRent, PaymentType, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { VehicleStatsComponent } from '../../../vehicle/vehicle-stats';
import { responsiveCarouselOptions } from './catalog-carousel.config';
import { SelectPaymentMethodComponent } from '../../../misc/select-payment-method';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { StaticAssetPipe } from '@revolt-rp/common-ui';


@Component({
  selector: 'app-rent-catalog',
  standalone: true,
  imports: [CommonModule, CarouselModule, TagModule, Button, ProgressSpinnerModule, TranslatePipe, ButtonDirective, StaticAssetPipe, DialogModule, VehicleStatsComponent, SelectPaymentMethodComponent, CheckboxModule, FormsModule, SliderModule],
  templateUrl: './rent-catalog.component.html',
  styleUrl: './rent-catalog.component.css'
})
export class RentCatalogComponent implements OnInit, OnDestroy {
  readonly carouselResponsiveOptions = responsiveCarouselOptions;

  property!: IProperty;
  selectedVehicle: IProduct | null = null;
  previewVehicle = false;

  paymentMethod: IPayment = {
    type: PaymentType.Cash
  };

  duration = 0.5;
  termsAccepted = false;

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

  rentVehicle() {
    if (!this.selectedVehicle)
      return;

    if (!this.termsAccepted)
      return;

    const body: IVehicleRent = {
      propertyId: this.property.id,
      model: this.selectedVehicle.name,
      duration: this.duration,
      payment: this.paymentMethod
    };

    this.rageClientService.triggerServer(ProcedureKey.SERVER_PROPERTY_RENT_VEHICLE, body);
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }
}
