import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { GameUiKey, IProperty, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { DrivingQuizComponent } from './components/driving-quiz';
import { VehicleRegistrationComponent } from './components/vehicle-registration';


@Component({
  selector: 'app-dmv-menu',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  providers: [DialogService],
  templateUrl: './dmv-menu.component.html',
  styleUrl: './dmv-menu.component.css'
})
export class DmvMenuComponent implements OnInit, OnDestroy {
  property!: IProperty;

  constructor(
    private rageClientService: RageClientService,
    private dialogService: DialogService,
    private translateService: TranslateService) {
  }

  private setProperty = (property: IProperty) => {
    this.property = property;
  };


  takeDrivingQuiz() {
    this.dialogService.open(DrivingQuizComponent, {
      header: this.translateService.instant('dmv_menu.driving_quiz'),
      width: '40%',
      data: this.property,
      focusOnShow: false,
      modal: true
    });
  }

  registerVehicle() {
    this.dialogService.open(VehicleRegistrationComponent, {
        header: this.translateService.instant('dmv_menu.vehicle_registration'),
        width: '45%',
        modal: true,
        data: this.property,
        focusOnShow: false,
        closable: true,
        dismissableMask: true
      }
    );
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.DmvMenu);
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PROPERTY, this.setProperty);
  }
}
