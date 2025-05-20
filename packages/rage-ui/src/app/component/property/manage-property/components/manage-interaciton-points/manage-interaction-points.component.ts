import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonDirective } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import {
  deepCopy,
  IProperty,
  IPropertyPoint,
  ProcedureKey,
  PropertyPointType,
} from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-manage-interaction-points',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TranslatePipe,
    ButtonDirective,
    TooltipModule,
    ChipModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    ConfirmPopupModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './manage-interaction-points.component.html',
  styleUrl: './manage-interaction-points.component.css',
})
export class ManageInteractionPointsComponent {
  @Input() property!: IProperty;

  pointTypes = Object.values(PropertyPointType);
  pointClones: Record<string, IPropertyPoint> = {};

  get points() {
    return this.property.points;
  }

  constructor(
    private rageClientService: RageClientService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {}

  create() {
    this.rageClientService
      .callServer<IPropertyPoint>(
        ProcedureKey.SERVER_CREATE_PROPERTY_POINT,
        this.property.id
      )
      .subscribe({
        next: (point) => {
          this.points.push(point);
        },
      });
  }

  remove(event: MouseEvent, point: IPropertyPoint) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translateService.instant('delete_property_point'),
      icon: 'pi pi-question-circle',
      rejectLabel: this.translateService.instant('no'),
      acceptLabel: this.translateService.instant('yes'),
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.rageClientService.callServer<void>(
          ProcedureKey.SERVER_DELETE_PROPERTY_POINT,
          point.id
        );
      },
    });
  }

  editInit(point: IPropertyPoint) {
    this.pointClones[point.id] = deepCopy(point);
  }

  editCancel(point: IPropertyPoint, index: number) {
    this.points[index] = this.pointClones[point.id];
    delete this.pointClones[point.id];
  }

  editSave(point: IPropertyPoint, index: number) {
    const update = point;
    this.editCancel(point, index);
    this.rageClientService
      .callServer<IPropertyPoint>(
        ProcedureKey.SERVER_UPDATE_PROPERTY_POINT,
        update
      )
      .subscribe({ next: (updated) => (this.points[index] = updated) });
  }
}
