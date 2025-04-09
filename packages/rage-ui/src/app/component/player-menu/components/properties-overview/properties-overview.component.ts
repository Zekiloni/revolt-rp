import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { IProperty, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';

@Component({
  selector: 'app-properties-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './properties-overview.component.html',
  styleUrl: './properties-overview.component.css',
})
export class PropertiesOverviewComponent {
  $properties!: Observable<IProperty[]>;

  constructor(private rageClientService: RageClientService) {
    this.getProperties();
  }

  private getProperties() {
    this.$properties = this.rageClientService.callServer<IProperty[]>(ProcedureKey.SERVER_GET_PLAYER_PROPERTIES);
  }
}
