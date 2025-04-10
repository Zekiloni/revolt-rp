import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { interval, map, Observable, startWith } from 'rxjs';
import { AdminType, IAccount, ProcedureKey } from '@revolt-rp/common';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { dayjs } from '../../../../domain/util/dajys.util';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [CommonModule, AvatarModule, TagModule, TranslatePipe],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.css'
})
export class AccountOverviewComponent {
  $account!: Observable<IAccount>;

  constructor(private rageClientService: RageClientService, private translateService: TranslateService) {
    this.getAccount();
  }

  private getAccount() {
    this.$account = this.rageClientService.callServer<IAccount>(ProcedureKey.SERVER_GET_PLAYER_ACCOUNT);
  }

  $sessionDuration(lastLoginAt: Date): Observable<string> {
    const loginTime = dayjs(lastLoginAt);

    return interval(1000).pipe(
      startWith(0),
      map(() => {
        const diffMs = dayjs().diff(loginTime);
        const dur = dayjs.duration(diffMs);

        const hours = dur.hours().toString().padStart(2, '0');
        const minutes = dur.minutes().toString().padStart(2, '0');
        const seconds = dur.seconds().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
      })
    );
  }

  createArray(length: number) {
    return new Array(length).fill(0).map((x, i) => i);
  }

  getAdminLevelLabel(administrator: AdminType) {
    return this.translateService.instant('admin_level')[administrator];
  }

  getAdminLevelSeverity(administrator: AdminType) {
    if (administrator === AdminType.MODERATOR) {
      return 'success';
    } else if (administrator > AdminType.MODERATOR) {
      return 'danger';
    }
    return 'info';
  }
}
