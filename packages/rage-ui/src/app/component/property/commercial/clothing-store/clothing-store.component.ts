import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {
  IClothingCartItem,
  IClothingProduct,
  IPayment,
  IProperty,
  PaymentType,
  ProcedureKey,
  IShopping, ICartItem
} from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { getClothingIcon, getItemIcon } from '../../../../domain/util/item.util';
import { StaticAssetPipe } from '../../../../domain/pipe/static-asset.pipe';
import { ScrollerModule } from 'primeng/scroller';
import { ImageModule } from 'primeng/image';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ShoppingCartBase } from '../shopping-cart/shopping-cart.base';
import { SelectPaymentMethodComponent } from '../../../misc/select-payment-method';
import { Ripple } from 'primeng/ripple';
import { DropdownChangeEvent } from 'primeng/dropdown';



interface IDrawableVariation {
  drawableId: number;
  textureId: number;
}


@Component({
  selector: 'app-clothing-store',
  standalone: true,
  imports: [CommonModule, DialogModule, InputTextModule, Button, TranslatePipe, ButtonDirective, StaticAssetPipe, ScrollerModule, NgOptimizedImage, ImageModule, PaginatorModule, SelectPaymentMethodComponent, Ripple],
  templateUrl: './clothing-store.component.html',
  styleUrl: './clothing-store.component.css'
})
export class ClothingStoreComponent extends ShoppingCartBase implements OnInit, OnDestroy {
  @Input() isActive!: boolean;

  title = '';
  property!: IProperty;

  pedModel: 'mp_m_freemode_01' | 'mp_f_freemode_01' = 'mp_m_freemode_01';
  type = 'clothing' as const;

  componentVariations: Record<number, IDrawableVariation[]> = {};
  selectedCategory: IClothingProduct | null = null;
  pageIndex = 0;
  pageSize = 10;
  pageItems: IDrawableVariation[] = [];
  activePreviewClothing: Record<number, IDrawableVariation> = {};

  override shoppingCart:IClothingCartItem[] = [];
  checkoutActive = false;

  paymentMethod: IPayment = {
    type: PaymentType.Cash
  };

  constructor(private rageClientService: RageClientService) {
    super();
  }

  get products() {
    return this.property.catalog as IClothingProduct[];
  }

  private setProperty = (property: IProperty) => {
    this.property = property;
    this.title = property.name || '';
  };

  private getComponentVariations(componentId: number) {
    if (this.componentVariations[componentId]) {
      return;
    }

    return this.rageClientService.callClient<number[]>(ProcedureKey.CLIENT_GET_DRAWABLE_VARIATIONS, componentId)
      .subscribe(drawables => {
        drawables.forEach(drawableId => {
          this.getTextureVariations(componentId, drawableId)
            .subscribe(textureVariations => {
              if (!this.componentVariations[componentId]) {
                this.componentVariations[componentId] = [];
              }

              if (textureVariations.length === 0) {
                this.componentVariations[componentId].push({
                  drawableId,
                  textureId: 0
                });
              } else {
                textureVariations.forEach(textureId => {
                  this.componentVariations[componentId].push({
                    drawableId,
                    textureId
                  });
                });
              }

              this.onPageChange({
                first: this.pageIndex,
                rows: this.pageSize
              });
            });
        });
      });
  }

  private getTextureVariations(componentId: number, drawableId: number) {
    return this.rageClientService.callClient<number[]>(ProcedureKey.CLIENT_GET_TEXTURE_VARIATIONS, [componentId, drawableId]);
  }

  addClothingToCart(product: IClothingProduct, drawable: number, texture: number) {

    this.shoppingCart.push({
      product,
      quantity: 1,
      drawable,
      texture
    });
  }

  removeClothingFromCart(cartItem: IClothingCartItem) {
    const index = this.shoppingCart.findIndex(item => item.product.id === cartItem.product.id
      && item.drawable === cartItem.drawable && item.texture === cartItem.texture);
    if (index !== -1) {
      this.shoppingCart.splice(index, 1);
    }
  }

  getClothingImage(componentId: number, drawableId: number, textureId: number) {
    return getClothingIcon(this.pedModel, this.type, componentId, drawableId, textureId);
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_CLOTHING_STORE, null);
  }

  selectCategory(event: DropdownChangeEvent) {
    if (this.checkoutActive) {
      this.checkoutActive = false;
    }

    if (event.value)
      this.getComponentVariations(event.value.data.componentId);
  }

  previewClothing(selectedComponentId: number, drawable: number, texture: number) {
    this.activePreviewClothing[selectedComponentId] = {
      drawableId: drawable,
      textureId: texture
    };

    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CLOTHING_PREVIEW, [selectedComponentId, drawable, texture]);
  }

  onPageChange(event: PaginatorState) {
    if (!this.selectedCategory) {
      return;
    }

    this.pageIndex = event.first || 0;
    this.pageSize = event.rows || 10;

    this.pageItems = this.componentVariations[this.selectedCategory.data.componentId].slice(this.pageIndex, this.pageIndex + this.pageSize);
  }

  checkout() {
    const request: IShopping<IClothingProduct> = {
      propertyId: this.property.id,
      shoppingCart: this.shoppingCart,
      payment: this.paymentMethod
    };

    this.rageClientService.triggerServer(ProcedureKey.SERVER_CLOTHING_STORE_BUY, request)
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
    this.rageClientService.callClient<'mp_m_freemode_01' | 'mp_f_freemode_01'>(ProcedureKey.CLIENT_GET_PLAYER_MODEL)
      .subscribe(model => this.pedModel = model);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }
}
