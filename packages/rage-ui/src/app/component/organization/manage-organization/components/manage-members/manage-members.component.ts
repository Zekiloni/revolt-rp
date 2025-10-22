import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button, ButtonDirective } from 'primeng/button';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { DialogService } from 'primeng/dynamicdialog';
import {
  deepCopy,
  ICharacter,
  IMemberUpdate,
  IOrganizationMemberInvite,
  IOrganizationRank
} from '@revolt-rp/common';
import { filterGlobal } from '../../../../../domain/util/table.util';
import { InviteMemberComponent } from '../invite-member';


export type ICharacterWithActivity = ICharacter & { averageActivity: number };

@Component({
  selector: 'app-manage-members',
  standalone: true,
  imports: [CommonModule, Button, ButtonDirective, PrimeTemplate, TableModule, TranslatePipe, TooltipModule, IconFieldModule, InputIconModule, InputTextModule, ConfirmPopupModule, DropdownModule, FormsModule, ChipModule],
  providers: [DialogService],
  templateUrl: './manage-members.component.html',
  styleUrl: './manage-members.component.css'
})
export class ManageMembersComponent {
  protected readonly filterGlobal = filterGlobal;

  @Input() ranks!: IOrganizationRank[];
  @Input() members!: ICharacterWithActivity[];

  @Output() memberUninvite = new EventEmitter<ICharacter>();
  @Output() memberUpdate = new EventEmitter<IMemberUpdate>();
  @Output() memberInvite = new EventEmitter<IOrganizationMemberInvite>();

  memberClones: Record<string, ICharacterWithActivity> = {};

  constructor(
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private translateService: TranslateService) {
  }

  uninviteMember(event: Event, member: ICharacter) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translateService.instant('uninvite_member_confirm', { member: member.fullName }),
      icon: 'pi pi-question-circle',
      rejectLabel: this.translateService.instant('no'),
      acceptLabel: this.translateService.instant('yes'),
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.memberUninvite.emit(member);
      }
    });
  }

  getActivityColor(score: number) {
    if (score >= 4) return 'text-green-500';
    if (score >= 1.8) return 'text-green-300';
    if (score >= 0.8) return 'text-orange-300';
    return 'text-red-400';
  }

  getActivityLabel(score: number) {
    if (score >= 4) return 'highly_active';
    if (score >= 1.8) return 'active';
    if (score >= 0.8) return 'moderate';
    return 'inactive';
  }

  onMemberEditCancel(member: ICharacterWithActivity, index: number) {
    this.members[index] = this.memberClones[member.id];
    delete this.memberClones[member.id];
  }

  onMemberSave(member: ICharacterWithActivity, index: number) {
    const memberUpdate: IMemberUpdate = {
      characterId: member.id,
      rankId: member.membership?.rank?.id as string
    };

    this.onMemberEditCancel(member, index);
    this.memberUpdate.emit(memberUpdate);
  }

  onMemberEditInit(member: ICharacterWithActivity) {
    this.memberClones[member.id] = deepCopy(member);
  }

  inviteMember() {
    this.dialogService.open(InviteMemberComponent, {
      header: this.translateService.instant('invite_new_member'),
      data: this.ranks
    }).onClose.subscribe((invite?: IOrganizationMemberInvite) => {
      if (invite) {
        this.memberInvite.emit(invite);
      }
    });
  }
}
