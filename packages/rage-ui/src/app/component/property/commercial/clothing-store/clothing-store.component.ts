import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IProduct, IProperty, IWearableItem, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { getItemIcon } from '../../../../domain/util/item.util';


@Component({
  selector: 'app-clothing-store',
  standalone: true,
  imports: [CommonModule, DialogModule, InputTextModule, Button, TranslatePipe, ButtonDirective],
  templateUrl: './clothing-store.component.html',
  styleUrl: './clothing-store.component.css'
})
export class ClothingStoreComponent implements OnInit, OnDestroy {
  @Input() isActive!: boolean;

  title = '';
  property!: IProperty;

  pedModel: 'mp_m_freemode_01' | 'mp_f_freemode_01' = 'mp_m_freemode_01';
  type = 'clothing';

  selectedComponentId: number | null = null;
  componentVariations: Record<number, number[]> = {};

  constructor(private rageClientService: RageClientService) {
  }

  get products() {
    return this.property.catalog as (IProduct & { info: IWearableItem })[];
  }

  private setProperty = (property: IProperty) => {
    this.property = property;
  };

  private getComponentVariations(componentId: number) {
    if (this.componentVariations[componentId]) {
      return;
    }

    return this.rageClientService.callClient<number[]>(ProcedureKey.CLIENT_GET_DRAWABLE_VARIATIONS, componentId)
      .subscribe(variations => {
        variations.forEach(drawableId => {
          this.getTextureVariations(componentId, drawableId)
            .subscribe(textureVariations => {
              this.componentVariations[drawableId] = textureVariations;
            });
        });
      });
  }

  private getTextureVariations(componentId: number, drawableId: number) {
    return this.rageClientService.callClient<number[]>(ProcedureKey.CLIENT_GET_TEXTURE_VARIATIONS, [componentId, drawableId]);
  }

  getClothingImage(componentId: number, drawableId: string, textureId: number) {
    return getItemIcon(`${this.pedModel}_${this.type}_${componentId}_${drawableId}_${textureId}_0.png`);
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_CLOTHING_STORE, null);
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
    this.rageClientService.callClient<'mp_m_freemode_01' | 'mp_f_freemode_01'>(ProcedureKey.CLIENT_GET_PLAYER_MODEL)
      .subscribe(model => this.pedModel = model);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }

  selectCategory(product: IProduct & { info: IWearableItem }) {
    this.selectedComponentId = product.info.componentId;
    this.getComponentVariations(product.info.componentId);
  }

  previewClothing(selectedComponentId: number, drawable: string, texture: number) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CLOTHING_PREVIEW, [selectedComponentId, Number(drawable), texture]);
  }
}
