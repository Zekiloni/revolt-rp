import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input, OnDestroy } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { WorldMapComponent } from '@revolt-rp/common-ui';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, WorldMapComponent, ButtonDirective, IconFieldModule, InputIconModule, InputTextModule, TranslatePipe, OverlayPanelModule, AutoCompleteModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnDestroy {
  map!: L.Map;

  @Input() phoneItem!: IPhoneItem;
  currentLocation: L.Marker | null = null;
  firstTime = true;

  constructor(
    private rageClientService: RageClientService,) {
  }

  private setCurrentPosition = (position: L.LatLng) => {
    if (this.currentLocation) {
      this.currentLocation.setLatLng(position);

      if (this.firstTime) {
        this.map.setView(position, 15);
        this.firstTime = false;
      }
    } else {
      this.currentLocation = L.marker(position).addTo(this.map);
    }
  };

  mapOnInit(map: L.Map) {
    this.map = map;
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PHONE_MAP_INIT, true);
    this.rageClientService.on(ProcedureKey.BROWSER_SET_CURRENT_LOCATION, this.setCurrentPosition);
  }

  ngOnDestroy(): void {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PHONE_MAP_INIT, false);
    this.rageClientService.off(ProcedureKey.BROWSER_SET_CURRENT_LOCATION, this.setCurrentPosition);
  }
}
