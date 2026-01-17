import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IProperty } from '@revolt-rp/common';
import { PropertyService } from '../../../core/service/property.service';
import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { StaticAssetPipe, WorldMapComponent } from '@revolt-rp/common-ui';
import * as L from 'leaflet';

@Component({
  selector: 'app-character-property',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    WorldMapComponent,
    NgClass
  ],
  providers: [PropertyService, StaticAssetPipe],
  templateUrl: './character-property.component.html',
  styleUrl: './character-property.component.css'
})
export class CharacterPropertyComponent implements OnInit {
  $properties!: Observable<IProperty[]>;

  constructor(
    private route: ActivatedRoute, private propertyService: PropertyService, private staticAssetPipe: StaticAssetPipe) {
  }


  ngOnInit() {
    this.route.parent?.params.subscribe((params) => {
      const characterId = params['characterId'];
      console.log('characterid', characterId);
      this.$properties = this.propertyService.getAllProperties({
        'owner.type': 'Character',
        'owner.entity': characterId
      })
        .pipe(map((res => res.properties)));
    });
  }

  mapOnInit(map: L.Map, property: IProperty) {
    const icon = L.icon({
      iconUrl: this.staticAssetPipe.transform(
        `assets/images/blips/${property?.spriteType || 1}.png`
      ),
      iconSize: [24, 24],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    map.dragging.disable();
    map.touchZoom.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable()
    map.setView([property.position.y, property.position.x], 15);
    L.marker([property.position.y, property.position.x], {
      icon
    }).addTo(map);
  }

  openManagePeople(property: IProperty) {

  }

  openDelete(property: IProperty) {

  }
}
