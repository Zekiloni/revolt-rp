import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IProperty,
  IPropertyVehicle,
  IPropertyVehicleCreate,
  ProcedureKey,
} from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { AddVehicleComponent } from '../add-vehicle';
import { ButtonDirective } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

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
    DialogModule,
    AddVehicleComponent,
    ButtonDirective,
    TooltipModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './manage-property-vehicles.component.html',
  styleUrl: './manage-property-vehicles.component.css',
})
export class ManagePropertyVehiclesComponent {
  @Input() property!: IProperty;

  isCreateDialogVisible = false;

  get vehicles() {
    return this.property.vehicles;
  }

  constructor(
    private rageClientService: RageClientService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {}

  private handleVehicleAdd = (vehicle: IPropertyVehicle) => {
    this.isCreateDialogVisible = false;
    return this.property.vehicles.push(vehicle);
  };

  deleteVehicle(event: MouseEvent, vehicle: IPropertyVehicle) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translateService.instant('delete_property_point'),
      icon: 'pi pi-question-circle',
      rejectLabel: this.translateService.instant('no'),
      acceptLabel: this.translateService.instant('yes'),
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.rageClientService
          .callServer<IPropertyVehicle[]>(
            ProcedureKey.SERVER_DELETE_PROPERTY_VEHICLE,
            vehicle.id
          )
          .subscribe((response) => (this.property.vehicles = response));
      },
    });
  }

  addVehicle(vehicleAdd: IPropertyVehicleCreate) {
    vehicleAdd.propertyId = this.property.id;
    this.rageClientService
      .callServer<IPropertyVehicle>(
        ProcedureKey.SERVER_CREATE_PROPERTY_VEHICLE,
        vehicleAdd
      )
      .subscribe({ next: this.handleVehicleAdd });
  }

  getRgbString(color?: any): string {
    return color ? `rgb(${color.r},${color.g},${color.b})` : '';
  }
}
