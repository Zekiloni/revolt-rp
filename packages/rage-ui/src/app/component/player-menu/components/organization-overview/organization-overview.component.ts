import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap, tap } from 'rxjs';
import { IAccount, ICharacter, ICharacterOrganization, IOrganization, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { MessagesModule } from 'primeng/messages';
import { TranslatePipe } from '@ngx-translate/core';
import { ChipModule } from 'primeng/chip';
import { Button } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';


@Component({
  selector: 'app-organization-overview',
  standalone: true,
  imports: [CommonModule, MessagesModule, TranslatePipe, ChipModule, Button, ProgressBarModule],
  templateUrl: './organization-overview.component.html',
  styleUrl: './organization-overview.component.css'
})
export class OrganizationOverviewComponent {
  $organization!: Observable<IOrganization | null>;
  $members?: Observable<ICharacter[]>;

  constructor(private rageClientService: RageClientService) {
    this.getCharacterOrganization();
  }

  private getCharacterOrganization() {
    this.$organization = this.rageClientService
      .callServer<ICharacter>(ProcedureKey.SERVER_GET_PLAYER_CHARACTER)
      .pipe(
        switchMap(({ membership }) =>
          membership?.organization ?
            this.getOrganization(membership)
            : of(null)
        )
      );
  }

  private getOrganizationMembers(organizationId: string) {
    return this.rageClientService.callServer<ICharacter[]>(ProcedureKey.SERVER_GET_ORGANIZATION_MEMBERS, organizationId);
  }

  private getOrganization(membership: ICharacterOrganization) {
    return this.rageClientService.callServer<IOrganization>(ProcedureKey.SERVER_GET_ORGANIZATION, membership.organization)
      .pipe(
        tap(organization => this.$members = this.getOrganizationMembers(organization.id))
      );
  }

  getMemberUsername(member: ICharacter) {
    return (<IAccount>member.account).username;
  }

  getMemberIcon(inGame: boolean) {
    return inGame ? 'pi pi-circle-on text-green-300' : 'pi pi-circle-off text-red-300';
  }

  toggleOrganizationPanel(id: string) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_ORGANIZATION_PANEL, id);
  }

  getParentOrganization(organization: IOrganization) {
    return organization.parentOrganization as IOrganization;
  }
}
