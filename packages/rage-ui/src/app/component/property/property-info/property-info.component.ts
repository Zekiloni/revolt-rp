import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICharacter, IOrganization, IProperty, ProcedureKey, purchasablePropertyTypes } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';


@Component({
  selector: 'app-property-info',
  standalone: true,
  imports: [CommonModule, TranslatePipe, TagModule, SkeletonModule],
  templateUrl: './property-info.component.html',
  styleUrl: './property-info.component.css'
})
export class PropertyInfoComponent implements OnInit, OnDestroy {
  property: IProperty | null = null;

  constructor(private rageClientService: RageClientService) {
  }

  get isForSale() {
    if (!purchasablePropertyTypes.includes(this.property!.type))
      return false;

    return this.property?.forSale || !this.property?.owner;
  }

  private setProperty = (property: IProperty) => {
    this.property = property;
  };

  getOwnerNamer(owner: IProperty['owner']) {
    return owner?.type === 'Character' ? (<ICharacter>owner.entity).fullName : (<IOrganization>owner?.entity).name;
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PROPERTY_INFO, this.setProperty);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PROPERTY_INFO, this.setProperty);
  }
}
