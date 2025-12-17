import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IEquipment, IProperty, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';

@Component({
  selector: 'app-equipment-menu',
  standalone: true,
  imports: [],
  templateUrl: './equipment-menu.component.html',
  styleUrl: './equipment-menu.component.css'
})
export class EquipmentMenuComponent implements OnInit, OnDestroy {
  property: IProperty | null = null;
  equipment: IEquipment[] = [];

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
}
