import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { GameUiKey, IJobOption, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';


@Component({
  selector: 'app-job-menu',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './job-menu.component.html',
  styleUrl: './job-menu.component.css'
})
export class JobMenuComponent implements OnInit, OnDestroy {
  options: IJobOption[] = [];
  propertyId: string | null = null;

  constructor(private rageClientService: RageClientService) {
  }

  private setPropertyId = (propertyId: string) => {
    this.propertyId = propertyId;
  };

  private setOptions = (options: IJobOption[]) => {
    this.options = options;
  };

  callOption(option: IJobOption) {
    if (!this.propertyId)
      return;

    this.rageClientService.triggerServer(option.eventKey, this.propertyId);
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.JobMenu);
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PROPERTY_ID, this.setPropertyId);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_JOB_MENU, this.setOptions);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PROPERTY_ID, this.setPropertyId);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_JOB_MENU, this.setOptions);
  }
}
