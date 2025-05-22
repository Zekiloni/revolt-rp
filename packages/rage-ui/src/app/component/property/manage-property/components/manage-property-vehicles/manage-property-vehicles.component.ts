import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  deepCopy,
  IProperty,
  IPropertyVehicle,
  IPropertyVehicleCreate,
  ProcedureKey,
  vehicleModels,
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
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ColorPickerModule } from 'primeng/colorpicker';

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
    AutoCompleteModule,
    FormsModule,
    InputNumberModule,
    ColorPickerModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './manage-property-vehicles.component.html',
  styleUrl: './manage-property-vehicles.component.css',
})
export class ManagePropertyVehiclesComponent {
  @Input() property!: IProperty;

  isCreateDialogVisible = false;
  vehicleClones: Record<string, IPropertyVehicle> = {};

  vehicleModels = vehicleModels;
  filteredModels: string[] = [];

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

  searchModels(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    this.filteredModels = this.vehicleModels.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }

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

  getRgbString(color?: { r: number; g: number; b: number }): string {
    return color ? `rgb(${color.r},${color.g},${color.b})` : '';
  }

  editInit(vehicle: IPropertyVehicle) {
    this.vehicleClones[vehicle.id] = deepCopy(vehicle);
  }

  editCancel(vehicle: IPropertyVehicle, index: number) {
    this.vehicles[index] = this.vehicleClones[vehicle.id];
    delete this.vehicleClones[vehicle.id];
  }

  editSave(vehicle: IPropertyVehicle, index: number) {
    const update = vehicle;
    console.log(update);
    this.editCancel(vehicle, index);
    this.rageClientService
      .callServer<IPropertyVehicle>(
        ProcedureKey.SERVER_UPDATE_PROPERTY_VEHICLE,
        update
      )
      .subscribe({ next: (updated) => (this.vehicles[index] = updated) });
  }
}
