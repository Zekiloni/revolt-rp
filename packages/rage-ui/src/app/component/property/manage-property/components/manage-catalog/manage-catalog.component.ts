import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IProperty, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { ButtonDirective } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-manage-catalog',
  standalone: true,
  imports: [CommonModule, ButtonDirective, PrimeTemplate, TableModule, TranslatePipe],
  templateUrl: './manage-catalog.component.html',
  styleUrl: './manage-catalog.component.css'
})
export class ManageCatalogComponent implements OnInit {
  @Input() property!: IProperty;

  availableItems: string[] = [];

  constructor(private rageClientService: RageClientService) {
  }

  private loadAvailableProducts() {
    this.rageClientService.callServer<string[]>(ProcedureKey.SERVER_GET_CATALOG_AVAILABLE_ITEMS, this.property.id)
      .subscribe({ next: (items) => this.availableItems = items });
  }

  create() {

  }

  ngOnInit() {
    this.loadAvailableProducts();
  }
}
