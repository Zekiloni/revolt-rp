import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { IVehicle, IVehicleOption, IVehicleSellOffer, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { VehicleSellOfferComponent } from '../vehicle-sell-offer';


/**
 * Vehicle menu component
 */
@Component({
  selector: 'app-vehicle-menu',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  providers: [DialogService],
  templateUrl: './vehicle-menu.component.html',
  styleUrl: './vehicle-menu.component.css'
})
export class VehicleMenuComponent implements OnInit, OnDestroy {
  $options!: Observable<IVehicleOption[]>;

  constructor(private rageClientService: RageClientService, private dialogService: DialogService, private translateService: TranslateService) {
    this.getVehicleOptions();
  }

  /**
   * Fetches the list of vehicle options from the server.
   * @private
   */
  private getVehicleOptions() {
    this.$options = this.rageClientService.callServer<IVehicleOption[]>(ProcedureKey.SERVER_GET_VEHICLE_OPTIONS);
  }

  /**
   * Call the vehicle option
   * @param option
   */
  callOption(option: IVehicleOption): void {
    this.rageClientService.triggerServer(option.eventKey);
  }

  /**
   * Open the sell offer dialog
   * @param vehicle
   */
  private sellOfferDialog = (vehicle: IVehicle) => {
    this.dialogService.open(VehicleSellOfferComponent, {
      header: this.translateService.instant('vehicle_sell_offer'),
      data: vehicle
    }).onClose.subscribe((offer?: IVehicleSellOffer) => {
      if (offer) {
        this.rageClientService.triggerServer(ProcedureKey.SERVER_VEHICLE_SELL_OFFER, offer);
      }
    });
  };

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_VEHICLE_SELL_OFFER_DIALOG, this.sellOfferDialog);
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_VEHICLE_SELL_OFFER_DIALOG, this.sellOfferDialog);
  }
}
