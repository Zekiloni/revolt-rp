import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import {
  deepCopy,
  IProduct,
  IProductAdd,
  IProductRemove, IProductUpdate,
  IProperty,
  ProcedureKey
} from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { AddProductComponent } from '../add-product';
import { Tooltip } from 'primeng/tooltip';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ConfirmPopup } from 'primeng/confirmpopup';

@Component({
  selector: 'app-manage-catalog',
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
    PrimeTemplate,
    TableModule,
    TranslatePipe,
    DialogModule,
    AddProductComponent,
    Tooltip,
    InputNumber,
    FormsModule,
    ConfirmPopup
  ],
  providers: [ConfirmationService],
  templateUrl: './manage-catalog.component.html',
  styleUrl: './manage-catalog.component.css'
})
export class ManageCatalogComponent implements OnInit {
  @Input() property!: IProperty;

  productClones: Record<string, IProduct> = {};

  allAvailableItems: string[] = [];

  isCreateDialogVisible = false;

  get availableItems() {
    return this.allAvailableItems.filter(
      (item) => !this.property.catalog.some((product) => product.name === item)
    );
  }

  constructor(
    private rageClientService: RageClientService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService) {
  }

  private loadAvailableItems() {
    this.rageClientService
      .callServer<string[]>(
        ProcedureKey.SERVER_GET_CATALOG_AVAILABLE_ITEMS,
        this.property.id
      )
      .subscribe({ next: (items) => (this.allAvailableItems = items) });
  }

  private handleProductAdded = (product: IProduct) => {
    this.isCreateDialogVisible = false;
    return this.property.catalog.push(product);
  };

  addProduct(productAdd: IProductAdd) {
    productAdd.propertyId = this.property.id;
    this.rageClientService
      .callServer<IProduct>(ProcedureKey.SERVER_CATALOG_ADD_PRODUCT, productAdd)
      .subscribe({ next: this.handleProductAdded });
  }

  deleteProduct(event: MouseEvent, product: IProduct) {
    console.log('Deleting product', product);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translateService.instant('delete_product', { name: product.name }),
      icon: 'pi pi-question-circle',
      rejectLabel: this.translateService.instant('no'),
      acceptLabel: this.translateService.instant('yes'),
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        const deleteProduct: IProductRemove = {
          propertyId: this.property.id,
          product
        };

        this.rageClientService.callServer<void>(
          ProcedureKey.SERVER_CATALOG_REMOVE_PRODUCT,
          deleteProduct
        );
      }
    });
  }

  ngOnInit() {
    this.loadAvailableItems();
  }

  editSave(product: IProduct, rowIndex: number) {
    const update: IProductUpdate = {
      product: { ...product },
      propertyId: this.property.id
    };

    this.editCancel(product, rowIndex);

    this.rageClientService
      .callServer<IProduct>(
        ProcedureKey.SERVER_CATALOG_UPDATE_PRODUCT,
        update
      )
      .subscribe({ next: (updated) => (this.property.catalog[rowIndex] = updated) });
  }

  editCancel(product: IProduct, rowIndex: number) {
    this.property.catalog[rowIndex] = this.productClones[product.id];
    delete this.productClones[product.id];
  }

  editInit(product: IProduct) {
    this.productClones[product.id] = deepCopy(product);
  }
}
