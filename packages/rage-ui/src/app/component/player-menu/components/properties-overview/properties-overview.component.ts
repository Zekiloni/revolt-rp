import * as L from 'leaflet';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IProperty, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { StaticAssetPipe, WorldMapComponent } from '@revolt-rp/common-ui';

@Component({
  selector: 'app-properties-overview',
  standalone: true,
  imports: [CommonModule, WorldMapComponent, TranslatePipe],
  providers: [StaticAssetPipe],
  templateUrl: './properties-overview.component.html',
  styleUrl: './properties-overview.component.css'
})
export class PropertiesOverviewComponent {
  $properties!: Observable<IProperty[]>;

  maps: Record<string, L.Map> = {};

  constructor(private rageClientService: RageClientService, private staticAssetPipe: StaticAssetPipe) {
    this.getProperties();
  }

  private getProperties() {
    this.$properties = this.rageClientService.callServer<IProperty[]>(ProcedureKey.SERVER_GET_PLAYER_PROPERTIES);
  }


  mapOnInit(map: L.Map, property: IProperty) {
    const icon = L.icon({
      iconUrl: this.staticAssetPipe.transform(`assets/images/blips/${property?.spriteType || 1}.png`),
      iconSize: [24, 24],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this.maps[property.id] = map;
    this.maps[property.id].setView([property.position.y, property.position.x], 3);
    L.marker([property.position.y, property.position.x], { icon })
      .addTo(map);
  }
}
