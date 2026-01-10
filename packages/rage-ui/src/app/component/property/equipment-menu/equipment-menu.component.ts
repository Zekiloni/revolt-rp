import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IEquipment, IProperty, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { getItemIcon } from '../../../domain/util/item.util';
import { NgOptimizedImage } from '@angular/common';
import { ImgFallbackDirective } from '@revolt-rp/common-ui';

@Component({
  selector: 'app-equipment-menu',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ImgFallbackDirective
  ],
  templateUrl: './equipment-menu.component.html',
  styleUrl: './equipment-menu.component.css'
})
export class EquipmentMenuComponent implements OnInit, OnDestroy {
  property: IProperty | null = null;
  equipment: IEquipment[] = [
    {
      item: 'example_item_1',
      quantity: 5,
      limit: 10,
      data: {
        model: 'example_model_1',
        name: '',
        description: '',
        type: [],
        weight: 0,
        isStackable: false,
        isWeapon: false,
        isEquipable: false,
        isBankCard: false,
        isFishingBait: false,
        isAmmo: false
      },
      price: 100
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(private rageClientService: RageClientService) {
  }

  ngOnInit(): void {
    this.rageClientService
      .listen<{ property: IProperty; equipment: IEquipment[] }>(
        ProcedureKey.BROWSER_SET_EQUIPMENT_MENU
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ property, equipment }) => {
        this.property = property;
        this.equipment = equipment;
      });
  }

  take(equipment: IEquipment): void {
    this.rageClientService.triggerServer(ProcedureKey.SERVER_PROPERTY_TAKE_EQUIPMENT, [this.property?.id, equipment]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly getItemIcon = getItemIcon;
}
