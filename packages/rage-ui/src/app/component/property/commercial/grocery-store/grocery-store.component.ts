import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import {
  GameUiKey,
  ICartItem,
  IPayment,
  IProduct,
  IProperty,
  IShopping,
  PaymentType,
  ProcedureKey
} from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { StaticAssetPipe } from '../../../../domain/pipe/static-asset.pipe';
import { getItemIcon } from '../../../../domain/util/item.util';
import { PaginatorModule } from 'primeng/paginator';
import { SelectPaymentMethodComponent } from '../../../misc/select-payment-method';
import { BadgeModule } from 'primeng/badge';


@Component({
  selector: 'app-grocery-store',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, Ripple, Button, NgOptimizedImage, StaticAssetPipe, TranslatePipe, PaginatorModule, SelectPaymentMethodComponent, BadgeModule, ButtonDirective],
  templateUrl: './grocery-store.component.html',
  styleUrl: './grocery-store.component.css'
})
export class GroceryStoreComponent implements OnInit, OnDestroy {
  protected readonly getItemIcon = getItemIcon;

  property!: IProperty;

  checkoutActive = false;
  shoppingCart: ICartItem<IProduct>[] = [];
  paymentMethod: IPayment = {
    type: PaymentType.Cash
  };

  constructor(private rageClientService: RageClientService) {
  }

  private setProperty = (property: IProperty) => {
    this.property = property;
  };

  isOutOfStock(product: IProduct) {
    const cartItem = this.shoppingCart.find(item => item.product.name === product.name);
    const cartQuantity = cartItem ? cartItem.quantity : 0;
    return product.stock <= cartQuantity;
  }

  getRealPrice(product: IProduct) {
    return product.price * (1 - (product.discount || 0));
  }

  getTotalItems() {
    return this.shoppingCart.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.shoppingCart.reduce((total, item) => total + this.getRealPrice(item.product) * item.quantity, 0);
  }

  addToCart(product: IProduct) {
    if (this.isOutOfStock(product)) {
      return;
    }

    const shoppingCartItem = this.shoppingCart.find(item => item.product.name === product.name);

    if (shoppingCartItem) {
      shoppingCartItem.quantity++;
    } else {
      this.shoppingCart.push({
        product: product,
        quantity: 1
      });
    }
  }

  removeFromCart(product: IProduct) {
    this.shoppingCart = this.shoppingCart.filter(item => item.product.name !== product.name);
  }

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
