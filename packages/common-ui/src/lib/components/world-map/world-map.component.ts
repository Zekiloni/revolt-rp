import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StaticAssetPipe } from '../../pipe/static-asset.pipe';

@Component({
  selector: 'lib-world-map',
  standalone: true,
  imports: [CommonModule],
  providers: [StaticAssetPipe],
  templateUrl: './world-map.component.html',
  styleUrl: './world-map.component.css'
})
export class WorldMapComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Input() backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--surface-b');
  @Input() layerStyle: 'SATELLITE' | 'ATLAS' | 'GRID' = 'SATELLITE';
  @Output() init = new EventEmitter<L.Map>();

  private L: typeof import('leaflet') | null = null;
  private map: import('leaflet').Map | null = null;

  private readonly MapConfig = {
    center_x: 117.3,
    center_y: 172.8,
    scale_x: 0.02072,
    scale_y: 0.0205
  };

  private mapLayers!: Record<string, L.TileLayer>;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private staticAssetPipe: StaticAssetPipe) {
    this.initializeLayers();
  }

  private async initializeLayers() {
    this.L = await import('leaflet');

    if (!isPlatformBrowser(this.platformId))
      return;

    const L = this.L;

    this.mapLayers = {
      'SATELLITE': L.tileLayer(this.staticAssetPipe.transform('assets/images/map_tiles/satellite/{z}/{x}/{y}.jpg'), {
        minZoom: 0,
        maxZoom: 8,
        noWrap: true
      }),
      'ATLAS': L.tileLayer(this.staticAssetPipe.transform('assets/images/map_tiles/atlas/{z}/{x}/{y}.jpg'), {
        minZoom: 0,
        maxZoom: 5,
        noWrap: true
      }),
      'GRID': L.tileLayer(this.staticAssetPipe.transform('assets/images/map_tiles/grid/{z}/{x}/{y}.png'), {
        minZoom: 0,
        maxZoom: 5,
        noWrap: true
      })
    };
  }

  async ngOnInit() {
    const L = this.L;

    if (!L)
      return;

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
      zoom: 3
    });

    this.init.emit(this.map);
    setTimeout(() => this.map?.invalidateSize(true), 50);
  }
}
