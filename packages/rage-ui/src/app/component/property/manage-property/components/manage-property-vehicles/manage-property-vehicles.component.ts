import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProperty } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-property-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmPopupModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    TranslatePipe,
  ],
  templateUrl: './manage-property-vehicles.component.html',
  styleUrl: './manage-property-vehicles.component.css',
})
export class ManagePropertyVehiclesComponent {
  @Input() property!: IProperty;

  get vehicles() {
    return this.property.vehicles;
  }

  constructor(private rageClientService: RageClientService) {}
}
