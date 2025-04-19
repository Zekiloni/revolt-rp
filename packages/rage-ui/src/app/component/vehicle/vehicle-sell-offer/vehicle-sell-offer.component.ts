import { debounceTime } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownFilterEvent, DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IPlayer, IVehicle, IVehicleSellOffer, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';


@Component({
  selector: 'app-vehicle-sell-offer',
  standalone: true,
  imports: [CommonModule, Button, DropdownModule, InputNumberModule, TranslatePipe, FormsModule],
  templateUrl: './vehicle-sell-offer.component.html',
  styleUrl: './vehicle-sell-offer.component.css'
})
export class VehicleSellOfferComponent implements OnInit {
  nearbyPlayers: IPlayer[] = [];

  vehicle!: IVehicle;
  selectedTarget: number | null = null;
  price = 0;

  constructor(
    private rageClientService: RageClientService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig) {
    this.vehicle = this.dialogConfig.data;
  }

  private handleGetNearbyPlayers = (targets: IPlayer[]) => {
    this.nearbyPlayers = targets;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterNearbyPlayers(_event: DropdownFilterEvent) {
    this.rageClientService.callClient<IPlayer[]>(ProcedureKey.CLIENT_GET_NEARBY_PLAYERS)
      .pipe(debounceTime(300))
      .subscribe({ next: this.handleGetNearbyPlayers });
  }

  submit() {
    if (this.selectedTarget == null || this.price < 0)
      return;

    const payload: IVehicleSellOffer = {
      targetId: this.selectedTarget,
      price: this.price,
      vehicleId: this.vehicle.id
    };

    this.dialogRef.close(payload);
  }

  ngOnInit() {
    this.rageClientService.callClient<IPlayer[]>(ProcedureKey.CLIENT_GET_NEARBY_PLAYERS)
      .subscribe({ next: this.handleGetNearbyPlayers });
  }
}
