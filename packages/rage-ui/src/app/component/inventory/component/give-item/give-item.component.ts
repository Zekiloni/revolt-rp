import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { ProcedureKey } from '@bcrp-rage/common';


export interface GiveItemDialogOutput {
  targetId: number;
  quantity: number;
}

interface NearbyTarget {
  value: number;
  label: string;
}

@Component({
  selector: 'app-give-item',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    InputNumberModule,
    Button
  ],
  templateUrl: './give-item.component.html',
  styleUrl: './give-item.component.css'
})
export class GiveItemComponent implements OnInit {
  nearbyPlayers: NearbyTarget[] = [];
  selectedTarget: number | null = null;
  inputQuantity = 0;

  constructor(
    private rageClientService: RageClientService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig) {
    this.inputQuantity = this.dialogConfig.data;
  }

  ngOnInit() {
    this.rageClientService.callClient<NearbyTarget[]>(ProcedureKey.CLIENT_GET_NEARBY_PLAYERS)
      .subscribe({ next: this.handleGetNearbyPlayers });
  }

  submitGive() {
    if (this.selectedTarget == null)
      return;

    const payload: GiveItemDialogOutput = {
      targetId: this.selectedTarget,
      quantity: this.inputQuantity
    };

    this.dialogRef.close(payload);
  }

  private handleGetNearbyPlayers = (targets: NearbyTarget[]) => {
    this.nearbyPlayers = targets;
  };
}
