import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgClass, NgStyle } from '@angular/common';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {  IVehicle } from '@revolt-rp/common';
import { VehicleService } from '../../../core/service/vehicle.service';
import { StaticAssetPipe } from '@revolt-rp/common-ui';


@Component({
  selector: 'app-character-vehicles',
  imports: [
    AsyncPipe,
    DatePipe,
    NgClass,
    NgStyle,
    StaticAssetPipe
  ],
  providers: [VehicleService],
  templateUrl: './character-vehicles.component.html',
  styleUrl: './character-vehicles.component.css'
})
export class CharacterVehiclesComponent implements OnInit {
  $vehicles!: Observable<IVehicle[]>;

  constructor(private route: ActivatedRoute, private vehicleService: VehicleService) {
  }

  ngOnInit() {
    this.route.parent?.params.subscribe((params) => {
      const characterId = params['characterId'];
      this.$vehicles = this.vehicleService.getAllVehicles({ owner: characterId })
        .pipe(map((res => res.vehicles)));
    });
  }

  getVehicleImage(model: string) {
    return `assets/images/vehicles/${model}.png`;
  }

  getVehicleColorRGB(color: [number, number, number]) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  }

  deleteVehicle(v: IVehicle) {
    // TODO: Implement vehicle deletion
  }
}
