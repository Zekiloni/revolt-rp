import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { IProduct, IProductAdd, IProperty, ProcedureKey } from '@revolt-rp/common';
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

  addProduct(productAdd: IProductAdd) {
    productAdd.propertyId = this.property.id;
    this.rageClientService.callServer<IProduct>(ProcedureKey.SERVER_CATALOG_ADD_PRODUCT, productAdd)
      .subscribe({ next: (product) => this.property.catalog.push(product) });
  }

  ngOnInit() {
    this.loadAvailableItems();
  }
}
