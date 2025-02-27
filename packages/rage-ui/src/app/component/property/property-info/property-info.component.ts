import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { CommercialType, IProperty, ProcedureKey, PropertyType } from '@revolt-rp/common';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-property-info',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './property-info.component.html',
  styleUrl: './property-info.component.css'
})
export class PropertyInfoComponent implements OnInit, OnDestroy {
  property: Partial<IProperty> | null = {
    name: 'Property Name',
    type: PropertyType.Commercial,
    owner: {
      type: 'character',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      entity: {
        fullName: 'Owner Surname'
      }
    },
    subType: CommercialType.GroceryStore,
    price: 100000,
    forSale: true
  };

  constructor(private rageClientService: RageClientService) {
  }

  private setProperty = (property: IProperty) => {
    this.property = property;
  };

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PROPERTY_INFO, this.setProperty);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PROPERTY_INFO, this.setProperty);
  }
}
