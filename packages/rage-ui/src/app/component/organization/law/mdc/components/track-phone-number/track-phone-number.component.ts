import * as L from 'leaflet';
import { Component } from '@angular/core';
import { IVector3 } from '@revolt-rp/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { WorldMapComponent } from '@revolt-rp/common-ui';

export interface TrackPhoneNumberData {
  phoneNumber: string;
  position: IVector3;
}

@Component({
  selector: 'app-track-phone-number',
  standalone: true,
  imports: [
    WorldMapComponent
  ],
  templateUrl: './track-phone-number.component.html',
  styleUrl: './track-phone-number.component.css'
})
export class TrackPhoneNumberComponent {
  position!: IVector3;
  phoneNumber!: string;

  map!: L.Map;

  constructor(private dialogConfig: DynamicDialogConfig<TrackPhoneNumberData>) {
    const data = this.dialogConfig.data;
    if (!data) {
      throw new Error('TrackPhoneNumberComponent requires dialog data.');
    }

    this.phoneNumber = data.phoneNumber;
    this.position = data.position;
  }

  onMapInit(map: L.Map) {
    this.map = map;

    const bounds: L.LatLngBoundsExpression = [
      [this.position.y - 25, this.position.x - 25],
      [this.position.y + 25, this.position.x + 25]
    ];

    L.rectangle(bounds, {
      color: '#ff0000',
      fillColor: '#ff0000',
      opacity: 0.3,
      fillOpacity: 0.3,
      weight: 2
    }).addTo(map);

    map.setView([this.position.y, this.position.x], 3);
  }
}
