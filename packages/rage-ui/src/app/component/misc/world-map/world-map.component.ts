import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-map.component.html',
  styleUrl: './world-map.component.css',
})
export class WorldMapComponent implements OnInit{
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Input() backgroundColor =  getComputedStyle(document.documentElement).getPropertyValue('--surface-b');
  @Input() layerStyle: 'SATELLITE' | 'ATLAS' | 'GRID' = 'SATELLITE';
  @Output() init = new EventEmitter<L.Map>();

  private map: L.Map | null = null;

  private readonly MapConfig = {
    center_x: 117.3,
    center_y: 172.8,
    scale_x: 0.02072,
    scale_y: 0.0205
  };

  private readonly mapLayers: Record<string, L.TileLayer> = {
    'SATELLITE': L.tileLayer('/assets/images/map_tiles/satellite/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxZoom: 8,
      noWrap: true
    }),
    'ATLAS': L.tileLayer('/assets/images/map_tiles/atlas/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxZoom: 5,
      noWrap: true
    }),
    'GRID': L.tileLayer('/assets/images/map_tiles/grid/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 5,
      noWrap: true
    }),
  };

  ngOnInit(): void {
    this.map = new L.Map(this.mapContainer.nativeElement, {
      crs: L.extend({}, L.CRS.Simple, {
        projection: L.Projection.LonLat,
        scale: (zoom: number) => Math.pow(2, zoom),
        zoom: (sc: number) => Math.log(sc) / 0.6931471805599453,
        distance: (pos1: L.LatLng, pos2: L.LatLng) => {
          const x_diff = pos2.lng - pos1.lng;
          const y_diff = pos2.lat - pos1.lat;
          return Math.sqrt(x_diff * x_diff + y_diff * y_diff);
        },
        transformation: new L.Transformation(
          this.MapConfig.scale_x, this.MapConfig.center_x,
          -this.MapConfig.scale_y, this.MapConfig.center_y
        ),
        infinite: true
      }),
      attributionControl: false,
      zoomControl: false,
      minZoom: 1,
      maxZoom: 5,
      preferCanvas: true,
      layers: [this.mapLayers[this.layerStyle]],
      center: [0, 0],
      zoom: 3,
    });

    this.init.emit(this.map);
    setTimeout(() => this.map?.invalidateSize(true), 50);
  }
}
