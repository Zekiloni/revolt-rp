import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';
import { ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../domain/service/rage-client.service';


@Component({
  selector: 'app-player-offer',
  standalone: true,
  imports: [CommonModule, CardModule, TranslatePipe, Button],
  templateUrl: './player-offer.component.html',
  styleUrl: './player-offer.component.css'
})
export class PlayerOfferComponent implements OnInit, OnDestroy {
  description = '';

  constructor(private rageClientService: RageClientService) {
  }

  private setOffer = (description: string) => {
    this.description = description;
  };

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_INIT_OFFER, this.setOffer);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_INIT_OFFER, this.setOffer);
  }
}
