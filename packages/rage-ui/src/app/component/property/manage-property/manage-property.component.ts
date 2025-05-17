import * as L from 'leaflet';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { gameUiConfig, IProperty, IPropertyUpdate, ProcedureKey, PropertyType } from '@revolt-rp/common';
import { WorldMapComponent } from '../../misc/world-map/world-map.component';
import { StaticAssetPipe } from '../../../domain/pipe/static-asset.pipe';
import { PropertySettingsComponent } from './components/property-settings';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ManageCatalogComponent } from './components/manage-catalog';
import { ManagePropertyVehiclesComponent } from './components/manage-property-vehicles';


@Component({
  selector: 'app-manage-property',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TabViewModule,
    TranslatePipe,
    WorldMapComponent,
    PropertySettingsComponent,
    ButtonDirective,
    Ripple,
    ProgressSpinnerModule,
    ManageCatalogComponent,
    ManagePropertyVehiclesComponent,
  ],
  providers: [StaticAssetPipe],
  templateUrl: './manage-property.component.html',
  styleUrl: './manage-property.component.css',
})
export class ManagePropertyComponent implements OnInit, OnDestroy {
  @Input() isActive = gameUiConfig.manageProperty.isActive;

  title = '';
  property: IProperty | null = null;

  constructor(
    private rageClientService: RageClientService,
    private translateService: TranslateService,
    private staticAssetPipe: StaticAssetPipe
  ) {}

  get isResidential() {
    return this.property?.type === PropertyType.Residential;
  }

  get isCommercial() {
    return this.property?.type === PropertyType.Commercial;
  }

  get isGarage() {
    return this.property?.type === PropertyType.Garage;
  }

  private setProperty = (property: IProperty) => {
    this.property = property;
    this.title =
      property.name ??
      this.translateService.instant(
        this.property.subType || this.property.type
      );
  };

  private setPropertyLock = (locked: boolean) => {
    if (this.property) this.property.locked = locked;
  };

  close() {
    this.rageClientService.triggerClient(
      ProcedureKey.CLIENT_TOGGLE_PROPERTY_MENU,
      null
    );
  }

  togglePropertyStatus() {
    if (this.property)
      this.rageClientService
        .callServer<boolean>(
          ProcedureKey.SERVER_PROPERTY_LOCK,
          this.property.id
        )
        .subscribe({ next: this.setPropertyLock });
  }

  onMapInit(map: L.Map) {
    const icon = L.icon({
      iconUrl: this.staticAssetPipe.transform(
        `assets/images/blips/${this.property?.spriteType || 1}.png`
      ),
      iconSize: [24, 24],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    if (this.property) {
      L.marker([this.property.position.y, this.property.position.x], {
        icon,
      }).addTo(map);

      map.dragging.disable();
      map.touchZoom.disable();
      map.scrollWheelZoom.disable();
      map.setView([this.property.position.y, this.property.position.x], 5);
    }
  }

  onPropertyUpdate(update: IPropertyUpdate) {
    this.rageClientService
      .callServer<IProperty>(ProcedureKey.SERVER_PROPERTY_UPDATE, update)
      .subscribe({ next: this.setProperty });
  }

  ngOnInit(): void {
    this.rageClientService.on(
      ProcedureKey.BROWSER_SET_PROPERTY,
      this.setProperty
    );
  }

  ngOnDestroy(): void {
    this.rageClientService.off(
      ProcedureKey.BROWSER_SET_PROPERTY,
      this.setProperty
    );
  }
}
