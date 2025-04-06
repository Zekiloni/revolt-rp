import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IDealershipCheckout, IPayment, IProduct, PaymentType } from '@revolt-rp/common';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectPaymentMethodComponent } from '../../../../../misc/select-payment-method';

@Component({
  selector: 'app-vehicle-dealership-checkout',
  standalone: true,
  imports: [CommonModule, Button, TranslatePipe, SelectPaymentMethodComponent],
  templateUrl: './vehicle-dealership-checkout.component.html',
  styleUrl: './vehicle-dealership-checkout.component.css'
})
export class VehicleDealershipCheckoutComponent {
  paymentMethod: IPayment = {
    type: PaymentType.Cash
  };

  vehicle!: IProduct;

  constructor(private dialogRef: DynamicDialogRef, private dialogConfig: DynamicDialogConfig) {
    this.vehicle = this.dialogConfig.data;
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    const checkout: IDealershipCheckout = {
      propertyId: '',
      vehicle: this.vehicle,
      payment: this.paymentMethod
    };

    this.dialogRef.close(checkout);
  }
}
