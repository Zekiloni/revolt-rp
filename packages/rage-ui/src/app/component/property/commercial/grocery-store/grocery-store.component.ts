import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import {
  GameUiKey,
  IPayment,
  IProperty,
  IShopping,
  PaymentType,
  ProcedureKey
} from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { getItemIcon } from '../../../../domain/util/item.util';
import { PaginatorModule } from 'primeng/paginator';
import { SelectPaymentMethodComponent } from '../../../misc/select-payment-method';
import { BadgeModule } from 'primeng/badge';
import { ShoppingCartBase } from '../shopping-cart/shopping-cart.base';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { StaticAssetPipe } from '@revolt-rp/common-ui';


@Component({
  selector: 'app-grocery-store',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, Ripple, Button, NgOptimizedImage, StaticAssetPipe, TranslatePipe, PaginatorModule, SelectPaymentMethodComponent, BadgeModule, ButtonDirective, InputNumber, FormsModule],
  templateUrl: './grocery-store.component.html',
  styleUrl: './grocery-store.component.css'
})
export class GroceryStoreComponent extends ShoppingCartBase implements OnInit, OnDestroy {
  protected readonly getItemIcon = getItemIcon;

  property!: IProperty;

  checkoutActive = false;
  paymentMethod: IPayment = {
    type: PaymentType.Cash
  };

  constructor(private rageClientService: RageClientService) {
    super();
  }

  private setProperty = (property: IProperty) => {
    this.property = property;
  };


  checkout() {
    const request: IShopping<string> = {
      propertyId: this.property.id!,
      shoppingCart: this.shoppingCart.map(item => ({ ...item, product: item.product.name })),
      payment: this.paymentMethod
    };

    this.rageClientService.triggerServer(ProcedureKey.SERVER_GROCERY_STORE_BUY, request);
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.GroceryStore);
  }
}
