import dayjs from 'dayjs';
import * as L from 'leaflet';
import { forkJoin } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  ApiError, gameUiConfig,
  ICharacter, IMemberUpdate,
  IOrganization, IOrganizationMemberInvite,
  IOrganizationRank,
  IOrganizationRankCreate,
  ProcedureKey
} from '@revolt-rp/common';
import { ManageRanksComponent } from './components/manage-ranks/manage-ranks.component';
import { ICharacterWithActivity, ManageMembersComponent } from './components/manage-members';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { WorldMapComponent } from '../../misc/world-map/world-map.component';


@Component({
  selector: 'app-manage-organization',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslatePipe, TabViewModule, ReactiveFormsModule, FormsModule, ManageRanksComponent, ManageMembersComponent, WorldMapComponent],
  templateUrl: './manage-organization.component.html',
  styleUrl: './manage-organization.component.css'
})
export class ManageOrganizationComponent implements OnInit, OnDestroy {
  @Input() isActive = gameUiConfig.manageOrganization.isActive;

  private organizationId: string | null = null;
  organization: IOrganization | null = null;

  title = '';

  members: ICharacterWithActivity[] = [];

  constructor(
    private rageClientService: RageClientService,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {
  }

  private setMembers = (members: ICharacter[]) => {
    this.members = members.map(member => ({ ...member, averageActivity: this.calculateActivity(member) }));
  };

  get ranks() {
    return this.organization?.ranks as IOrganizationRank[];
  }

  set ranks(value: IOrganizationRank[]) {
    if (this.organization)
      this.organization.ranks = value;
  }

  get onlineMembers() {
    return this.members.filter(member => member.inGame);
  }

  get parentOrganization() {
    return this.organization?.parentOrganization as IOrganization;
  }

  private onRankCreated = (rank: IOrganizationRank) => {
    this.organization?.ranks.push(rank);
  };

  private loadOrganization = (organizationId: string) => {
    this.organizationId = organizationId;

    forkJoin([
      this.rageClientService.callServer<IOrganization>(ProcedureKey.SERVER_GET_ORGANIZATION, this.organizationId),
      this.rageClientService.callServer<ICharacter[]>(ProcedureKey.SERVER_GET_ORGANIZATION_MEMBERS, this.organizationId)
    ]).subscribe(([organization, members]) => {
      this.organization = organization;
      this.title = organization.name;
      this.setMembers(members);
    });
  };


  handleError = (error: ApiError) => {
    this.messageService.add({
      severity: 'error',
      summary: this.translateService.instant('error'),
      detail: error.message
    });
  };

  calculateActivity(character: ICharacter): number {
    if (!character.createdAt || character.hours <= 0) return 0;

    const accountAgeDays = Math.max(dayjs().diff(dayjs(character.createdAt), 'day'), 1);
    return Math.round((character.hours / accountAgeDays) * 100) / 100;
  }

  toggleManageOrganization() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_ORGANIZATION_PANEL);
  }

  createRank(rank: IOrganizationRankCreate) {
    if (this.organization && this.organization.id) {
      rank.organizationId = this.organization.id;
      this.rageClientService.callServer<IOrganizationRank>(ProcedureKey.SERVER_CREATE_ORGANIZATION_RANK, rank)
        .subscribe({
          next: this.onRankCreated,
          error: this.handleError
        });
    }
  }

  deleteRank(rank: IOrganizationRank) {
    this.rageClientService.callServer(ProcedureKey.SERVER_ORGANIZATION_RANK_DELETE, rank.id)
      .subscribe({
        next: () => this.ranks = this.ranks.filter(r => r.id !== rank.id),
        error: this.handleError
      });
  }

  onMapInit(map: L.Map) {
    const icon = L.icon({
      iconUrl: '/assets/images/blips/radar_objective_blue.png',
      iconSize: [16, 16],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    if (this.organization) {
      L.marker([this.organization.position.y, this.organization.position.x], { icon })
        .bindTooltip(this.translateService.instant('headquarters'))
        .addTo(map);

      map.dragging.disable();
      map.touchZoom.disable();
      map.scrollWheelZoom.disable();
      map.setView([this.organization.position.y, this.organization.position.x], 5);
    }
  }

  handleMemberUninvite(member: ICharacter) {
    this.rageClientService.callServer<true>(ProcedureKey.SERVER_ORGANIZATION_MEMBER_UNINVITE, member.id)
      .subscribe({
        next: () => this.setMembers(this.members.filter(m => m.id !== member.id)),
        error: this.handleError
      });
  }

  handleMemberInvite(invite: IOrganizationMemberInvite) {
    this.rageClientService.triggerServer(ProcedureKey.SERVER_ORGANIZATION_MEMBER_INVITE, invite);
  }

  handleMemberUpdate(memberUpdate: IMemberUpdate) {
    this.rageClientService.callServer<ICharacter>(ProcedureKey.SERVER_ORGANIZATION_MEMBER_UPDATE, memberUpdate)
      .subscribe({
        next: member => this.setMembers(this.members.map(m => m.id === member.id ? member : m)),
        error: this.handleError
      });
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_ORGANIZATION_ID, this.loadOrganization);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_ORGANIZATION_ID, this.loadOrganization);
  }
}

