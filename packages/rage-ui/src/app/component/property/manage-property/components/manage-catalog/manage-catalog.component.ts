import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { IProduct, IProductAdd, IProductRemove, IProperty, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { AddProductComponent } from '../add-product';


@Component({
  selector: 'app-manage-catalog',
  standalone: true,
  imports: [CommonModule, ButtonDirective, PrimeTemplate, TableModule, TranslatePipe, DialogModule, Button, AddProductComponent],
  templateUrl: './manage-catalog.component.html',
  styleUrl: './manage-catalog.component.css'
})
export class ManageCatalogComponent implements OnInit {
  @Input() property!: IProperty;

  allAvailableItems: string[] = [];

  isCreateDialogVisible = false;

  get availableItems() {
    return this.allAvailableItems.filter((item) => !this.property.catalog.some((product) => product.name === item));
  }

  constructor(private rageClientService: RageClientService) {
  }

  private loadAvailableItems() {
    this.rageClientService.callServer<string[]>(ProcedureKey.SERVER_GET_CATALOG_AVAILABLE_ITEMS, this.property.id)
      .subscribe({ next: (items) => this.allAvailableItems = items });
  }

  private handleProductAdded = (product: IProduct) => {
    this.isCreateDialogVisible = false;
    return this.property.catalog.push(product);
  };

  addProduct(productAdd: IProductAdd) {
    productAdd.propertyId = this.property.id;
    this.rageClientService.callServer<IProduct>(ProcedureKey.SERVER_CATALOG_ADD_PRODUCT, productAdd)
      .subscribe({ next: this.handleProductAdded });
  }

  deleteProduct(product: IProduct) {
    const deleteProduct: IProductRemove = {
      propertyId: this.property.id,
      product
    };

    this.rageClientService.callServer<void>(ProcedureKey.SERVER_CATALOG_REMOVE_PRODUCT, deleteProduct);
  }

  ngOnInit() {
    this.loadAvailableItems();
  }
}
