import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IPayment, IProperty, IRegisterVehicle, IVehicle, PaymentType, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../../domain/service/rage-client.service';
import { StaticAssetPipe } from '../../../../../../domain/pipe/static-asset.pipe';
import { SelectPaymentMethodComponent } from '../../../../../misc/select-payment-method';

@Component({
  selector: 'app-vehicle-registration',
  imports: [CommonModule, ScrollPanelModule, TranslatePipe, StaticAssetPipe, SelectPaymentMethodComponent, ButtonDirective],
  templateUrl: './vehicle-registration.component.html',
  styleUrl: './vehicle-registration.component.css'
})
export class VehicleRegistrationComponent {
  $vehicles: Observable<IVehicle[]>;
  selectedVehicle: IVehicle | null = null;
  selectedTab: IRegisterVehicle['type'] = 'register';

  loading = false;
  renewalDays = 30;

  paymentMethod: IPayment = {
    type: PaymentType.Cash
  };

  constructor(private dialogConfig: DynamicDialogConfig<IProperty>, private dialogRef: DynamicDialogRef, private rageClientService: RageClientService) {
    this.$vehicles = this.rageClientService.callServer<IVehicle[]>(ProcedureKey.SERVER_GET_PLAYER_VEHICLES)
      .pipe(map((vehicles) => vehicles.filter(vehicle => !vehicle.rented || !vehicle.isTemporary)));
  }

  get property() {
    return this.dialogConfig.data;
  }

  isExpired(expirationDate: Date): boolean {
    const now = new Date();
    return expirationDate < now;
  }

  selectVehicle(vehicle: IVehicle, option: IRegisterVehicle['type']) {
    this.selectedVehicle = vehicle;
    this.selectedTab = option;
  }

  getVehicleImage(model: string) {
    return `assets/images/vehicles/${model}.png`;
  }

  confirmOption() {
    if (!this.selectedVehicle || !this.property) {
      return;
    }

    this.loading = true;

    const data: IRegisterVehicle = {
      vehicleId: this.selectedVehicle.id,
      type: this.selectedTab,
      payment: this.paymentMethod,
      propertyId: this.property.id
    };

    this.rageClientService.callServer<boolean>(ProcedureKey.SERVER_REGISTER_VEHICLE, data)
      .subscribe({ next: () => this.dialogRef.close(), complete: () => this.loading = false });
  }
}
