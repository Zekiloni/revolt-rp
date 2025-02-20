import dayjs from 'dayjs';
import { Component, Input, OnInit } from '@angular/core';
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
  IOrganizationRank,
  ProcedureKey
} from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { filterGlobal } from '../../../../../domain/util/table.util';
import { InviteMemberComponent } from '../invite-member';


type ICharacterWithActivity = ICharacter & { averageActivity: number };

@Component({
  selector: 'app-manage-members',
  standalone: true,
  imports: [CommonModule, Button, ButtonDirective, PrimeTemplate, TableModule, TranslatePipe, TooltipModule, IconFieldModule, InputIconModule, InputTextModule, ConfirmPopupModule, DropdownModule, FormsModule, ChipModule],
  providers: [ConfirmationService, DialogService],
  templateUrl: './manage-members.component.html',
  styleUrl: './manage-members.component.css'
})
export class ManageMembersComponent implements OnInit {
  @Input() organizationId!: string;
  @Input() ranks!: IOrganizationRank[];

  members: ICharacterWithActivity[] = [];
  memberClones: Record<string, ICharacterWithActivity> = {};

  constructor(private rageClientService: RageClientService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService,
              private translateService: TranslateService) {
  }

  private setMembers = (members: ICharacter[]) => {
    this.members = members.map(member => ({ ...member, averageActivity: this.calculateActivity(member) }));
  };


  calculateActivity(character: ICharacter): number {
    if (!character.createdAt || character.hours <= 0) return 0;

    const accountAgeDays = Math.max(dayjs().diff(dayjs(character.createdAt), 'day'), 1);
    return Math.round((character.hours / accountAgeDays) * 100) / 100;
  }

  ngOnInit(): void {
    this.setMembers([
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        inGame: true,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        account: {
          username: 'johndoe'
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        membership: {
          rank: this.ranks[0]
        },
        hours: 188,
        createdAt: dayjs('2025-01-01').toDate()
      },
      {
        id: '3',
        firstName: 'Zach',
        lastName: 'Test',
        fullName: 'Zach Test',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        account: {
          username: 'zekiloni'
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        membership: {
          rank: this.ranks[1]
        },
        hours: 3,
        createdAt: dayjs('2025-01-01').toDate()
      },
      {
        id: '2',
        firstName: 'Zach',
        lastName: 'Test',
        fullName: 'Konjo Test',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        account: {
          username: 'konel'
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        membership: {
          rank: this.ranks[1]
        },
        hours: 40,
        createdAt: dayjs('2025-01-01').toDate()
      }
    ]);
    this.rageClientService.callServer<ICharacter[]>(ProcedureKey.SERVER_GET_ORGANIZATION_MEMBERS)
      .subscribe({ next: this.setMembers });
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
        this.rageClientService.callServer(ProcedureKey.SERVER_ORGANIZATION_MEMBER_UNINVITE, member.id)
          .subscribe({ next: () => this.setMembers(this.members.filter(m => m.id !== member.id)) });
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

  filterGlobal = filterGlobal;

  onMemberEditCancel(member: ICharacterWithActivity, index: number) {
    this.members[index] = this.memberClones[member.id];
    delete this.memberClones[member.id];
  }


  onMemberSave(member: ICharacterWithActivity) {
    const memberUpdate: IMemberUpdate = {
      characterId: member.id,
      rankId: member.membership!.rank!.id as string
    };

    this.rageClientService.triggerServer(ProcedureKey.SERVER_ORGANIZATION_MEMBER_UPDATE, memberUpdate);
  }

  onMemberEditInit(member: ICharacterWithActivity) {
    this.memberClones[member.id] = deepCopy(member);
  }

  inviteMember() {
    this.dialogService.open(InviteMemberComponent, {}).onClose.subscribe((invite?: IOrganizationMemberInvite) => {
      if (invite) {
        // todo
      }
    });
  }
}
