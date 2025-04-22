import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { ICharacter, IOrganization, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { MessagesModule } from 'primeng/messages';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-organization-overview',
  standalone: true,
  imports: [CommonModule, MessagesModule, TranslatePipe],
  templateUrl: './organization-overview.component.html',
  styleUrl: './organization-overview.component.css'
})
export class OrganizationOverviewComponent {
  $organization!: Observable<IOrganization | null>;

  constructor(private rageClientService: RageClientService) {
    this.getOrganization();
  }

  private getOrganization() {
    this.$organization = this.rageClientService
      .callServer<ICharacter>(ProcedureKey.SERVER_GET_PLAYER_CHARACTER)
      .pipe(
        switchMap(({ membership }) =>
          membership?.organization ?
            this.rageClientService.callServer<IOrganization>(ProcedureKey.SERVER_GET_ORGANIZATION, membership.organization)
            : of(null)
        )
      );
  }
}
