import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import {
  IGroceryBuy,
  IPayment,
  IProduct,
  IProperty,
  IShoppingCart,
  PaymentType,
  ProcedureKey
} from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { StaticAssetPipe } from '../../../../domain/pipe/static-asset.pipe';
import { getItemIcon } from '../../../../domain/util/item.util';
import { PaginatorModule } from 'primeng/paginator';
import { SelectPaymentMethodComponent } from '../../../misc/select-payment-method';


@Component({
  selector: 'app-grocery-store',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, Ripple, Button, NgOptimizedImage, StaticAssetPipe, TranslatePipe, PaginatorModule, SelectPaymentMethodComponent],
  templateUrl: './grocery-store.component.html',
  styleUrl: './grocery-store.component.css'
})
export class GroceryStoreComponent implements OnInit, OnDestroy {
  protected readonly getItemIcon = getItemIcon;

  property: Partial<IProperty> = {
    name: 'Grocery Store',
    catalog: [
      { name: 'Flow 0.3l', price: 3, stock: 10, info: { name: 'Flow 0.3l', model: 'prop_ld_flow_bottle' } },
      {
        name: 'Pißwasser 0.35l',
        price: 5,
        stock: 5,
        discount: 0.2,
        info: { name: 'Pißwasser 0.35l', model: 'prop_amb_beer_bottle' }
      }
    ]
  };

  checkoutActive = false;
  shoppingCart: IShoppingCart<IProduct>[] = [];
  paymentMethod: IPayment = {
    type: PaymentType.Cash
  };

  constructor(private rageClientService: RageClientService) {
  }

  private setProperty(property: IProperty) {
    this.property = property;
  }

  isOutOfStock(product: IProduct) {
    return product.stock <= 0;
  }

  getRealPrice(product: IProduct) {
    return product.price * (1 - (product.discount || 0));
  }

  getTotalPrice() {
    return this.shoppingCart.reduce((total, item) => total + this.getRealPrice(item.product) * item.quantity, 0);
  }

  buy(product: IProduct) {
    this.shoppingCart.push({
      product: product,
      quantity: 1
    });
  }

  addToCart(product: IProduct) {
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
    const request: IGroceryBuy<string> = {
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
}
