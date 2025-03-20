import type { FilterQuery } from 'mongoose';
import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { IAdvertisement, IAdvertisementCreate, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { CreateAdvertisementComponent } from './components/create-advertisement';
import { SafeHtmlPipe } from '../../../../../domain/util/safe-html.pipe';


@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [CommonModule, TableModule, TranslatePipe, ButtonDirective, CreateAdvertisementComponent, SafeHtmlPipe],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.css'
})
export class AdvertisementComponent {
  @Input() phoneItem!: IPhoneItem;

  @ViewChild('adsTable') adsTable!: Table;

  advertisements: IAdvertisement[] = [];
  filter: FilterQuery<IAdvertisement> = {};
  totalRecords = 0;

  selectedAd!: IAdvertisement | null;

  creatingAd = false;

  constructor(private rageClientService: RageClientService) {
  }

  private handleAdvertisementCreated = (ad: IAdvertisement) => {
    this.creatingAd = false;
    this.selectedAd = ad;
  };

  onAdvertisementCreate(adCreate: IAdvertisementCreate) {
    this.rageClientService.callServer<IAdvertisement>(ProcedureKey.SERVER_CREATE_ADVERTISEMENT, adCreate)
      .subscribe({ next: this.handleAdvertisementCreated });
  }

  lazyLoadAdvertisements(event: TableLazyLoadEvent) {
    const limit = event.rows || 5;
    const skip = (event.first || 0) / (event.rows || 5) * limit;

    const query = {
      skip, limit,
      filter: this.filter
    };

    this.rageClientService.callServer<{
      advertisements: IAdvertisement[],
      total: number
    }>(ProcedureKey.SERVER_GET_ADVERTISEMENTS, query)
      .subscribe({
        next: response => {
          this.advertisements = response.advertisements;
          this.totalRecords = response.total;
        }
      });
  }
}
