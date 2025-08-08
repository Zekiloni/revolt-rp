import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProperty, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';

@Component({
  selector: 'app-garage-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './garage-menu.component.html',
  styleUrl: './garage-menu.component.css'
})
export class GarageMenuComponent implements OnInit, OnDestroy {
  property: IProperty | null = null;

  constructor(private rageClientService: RageClientService) {
  }

  private setGarage = (property: IProperty) => {
    this.property = property;
  };

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_GARAGE, this.setGarage);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_GARAGE, this.setGarage);
  }
}
