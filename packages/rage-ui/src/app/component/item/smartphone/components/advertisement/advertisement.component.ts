import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { CreateAdvertisementComponent } from './components/create-advertisement';
import { IAdvertisement, IAdvertisementCreate, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';

@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [CommonModule, TableModule, TranslatePipe, ButtonDirective, CreateAdvertisementComponent],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.css'
})
export class AdvertisementComponent {
  @Input() phoneItem!: IPhoneItem;

  products = [];

  selectedAd: IAdvertisement | null = null;
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
}
