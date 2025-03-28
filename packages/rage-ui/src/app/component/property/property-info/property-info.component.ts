import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ICharacter, IOrganization, IProperty, ProcedureKey, purchasablePropertyTypes } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { resizeAnimationTrigger } from '../../../domain/util/animation.util';


@Component({
  selector: 'app-property-info',
  standalone: true,
  imports: [CommonModule, TranslatePipe, TagModule, ProgressSpinnerModule],
  templateUrl: './property-info.component.html',
  styleUrl: './property-info.component.css',
  animations: [resizeAnimationTrigger]
})
export class PropertyInfoComponent implements OnInit, OnDestroy {
  property: IProperty | null = null;

  constructor(private rageClientService: RageClientService) {
  }

  get isForSale() {
    return this.property
      && purchasablePropertyTypes.includes(this.property.type)
      && (!this.property.owner || this.property.forSale);
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
