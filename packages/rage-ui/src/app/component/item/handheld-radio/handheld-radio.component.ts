import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IHandheldRadioConfig, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-handheld-radio',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonModule, InputSwitchModule, InputMaskModule, TooltipModule, TranslatePipe],
  templateUrl: './handheld-radio.component.html',
  styleUrl: './handheld-radio.component.css'
})
export class HandheldRadioComponent implements OnInit, OnDestroy {

  handheldRadioConfig: IHandheldRadioConfig | null = {
    power: false,
    frequency: null,
    simplex: 1,
    isConnected: false
  };

  constructor(private rageClientService: RageClientService) {
  }

  get isPowerOff() {
    return !this.handheldRadioConfig?.power;
  }

  private setHandheldRadioConfig = (handheldRadioConfig: IHandheldRadioConfig) => {
    this.handheldRadioConfig = handheldRadioConfig;
  };

  updateHandheldRadio() {
    this.rageClientService.callServer<IHandheldRadioConfig>(ProcedureKey.SERVER_HANDHELD_RADIO_UPDATE, this.handheldRadioConfig)
      .subscribe({ next: this.setHandheldRadioConfig });
  }

  getConnectionStatusClass() {
    return this.isPowerOff ? 'pi pi-power-off opacity-30' : this.handheldRadioConfig?.isConnected ? 'pi pi-circle-on text-green-600' : 'pi pi-circle-on text-red-700';
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_HANDHELD_RADIO, this.setHandheldRadioConfig);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_HANDHELD_RADIO, this.setHandheldRadioConfig);
  }
}
