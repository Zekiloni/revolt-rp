import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IAccount, IBan, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../domain/service/rage-client.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-ban-info',
  standalone: true,
  imports: [CommonModule, TranslatePipe, SkeletonModule],
  templateUrl: './ban-info.component.html',
  styleUrl: './ban-info.component.css'
})
export class BanInfoComponent implements OnInit, OnDestroy {
  ban: Partial<IBan> | null = null;

  constructor(private rageClientService: RageClientService) {
  }

  private setBanInfo = (ban: IBan) => {
    this.ban = ban;
  };

  getIssuer() {
    return this.ban?.admin ? (<IAccount>this.ban.admin).username : 'system';
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_BAN_INFO, this.setBanInfo);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_BAN_INFO, this.setBanInfo);
  }
}
