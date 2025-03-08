import L from 'leaflet';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ProcedureKey } from '@revolt-rp/common';
import { WorldMapComponent } from '../../../../misc/world-map/world-map.component';
import { RageClientService } from '../../../../../domain/service/rage-client.service';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, WorldMapComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnDestroy {
  map!: L.Map;
  currentLocation: L.Marker | null = null;

  constructor(private rageClientService: RageClientService) {
  }

  private setCurrentPosition = (position: L.LatLng) => {
    if (this.currentLocation) {
      this.currentLocation.setLatLng(position);
      this.map.setView(position, 3);
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
