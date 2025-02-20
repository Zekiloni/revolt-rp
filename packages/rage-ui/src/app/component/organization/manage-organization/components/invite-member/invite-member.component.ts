import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownFilterEvent, DropdownModule } from 'primeng/dropdown';
import { IOrganizationMemberInvite, IOrganizationRank, IPlayer, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';


@Component({
  selector: 'app-invite-member',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, ButtonDirective, InputTextModule, DropdownModule],
  templateUrl: './invite-member.component.html',
  styleUrl: './invite-member.component.css'
})
export class InviteMemberComponent {
  players: IPlayer[] = [];
  ranks!: IOrganizationRank[];
  inviteMemberFormGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: DynamicDialogRef, private dialogConfig: DynamicDialogConfig,
    private rageClientService: RageClientService
  ) {
    this.ranks = this.dialogConfig.data;
    this.buildMemberInviteForm();
  }

  get isFormInvalid() {
    return this.inviteMemberFormGroup.invalid;
  }

  private buildMemberInviteForm() {
    this.inviteMemberFormGroup = this.formBuilder.group({
      playerId: [null, [Validators.required]],
      rankId: [null, [Validators.required]]
    });
  }

  private setPlayers = (players: IPlayer[]) => {
    this.players = players;
  };

  filterPlayers(event: DropdownFilterEvent) {
    this.rageClientService.callClient<IPlayer[]>(ProcedureKey.CLIENT_FILTER_PLAYERS, event.filter)
      .subscribe({ next: this.setPlayers });
  }

  submitInviteMemberForm() {
    if (this.isFormInvalid)
      return;

    const inviteMember: IOrganizationMemberInvite = this.inviteMemberFormGroup.value;
    this.dialogRef.close(inviteMember);
  }
}
