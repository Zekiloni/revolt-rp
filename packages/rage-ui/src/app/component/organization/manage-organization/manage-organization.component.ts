import * as L from 'leaflet';
import { Types } from 'mongoose';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { TabViewModule } from 'primeng/tabview';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IOrganization,
  IOrganizationRank,
  IOrganizationRankCreate,
  OrganizationPermissionType,
  OrganizationType, ProcedureKey
} from '@revolt-rp/common';
import { ManageRanksComponent } from './components/manage-ranks/manage-ranks.component';
import { ManageMembersComponent } from './components/manage-members';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { WorldMapComponent } from '../../misc/world-map/world-map.component';

@Component({
  selector: 'app-manage-organization',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslatePipe, TabViewModule, ColorPickerModule, ReactiveFormsModule, FormsModule, ManageRanksComponent, ManageMembersComponent, WorldMapComponent],
  templateUrl: './manage-organization.component.html',
  styleUrl: './manage-organization.component.css'
})
export class ManageOrganizationComponent {
  @Input() isActive!: boolean;

  organization: Partial<IOrganization> = {
    name: 'Organization Name',
    shortName: 'ORG',
    type: OrganizationType.Company,
    createdAt: new Date(),
    position: { x: 0, y: 0, z: 0 },
    ranks: [
      {
        name: 'Rank 1',
        salary: 100,
        permission: OrganizationPermissionType.MANAGE_ORGANIZATION,
        id: '342423',
        _id: new Types.ObjectId()
      },
      {
        name: 'Rank 2',
        salary: 43,
        permission: OrganizationPermissionType.NORMAL,
        id: '342423',
        _id: new Types.ObjectId()
      }
    ]
  };

  constructor(private rageClientService: RageClientService) {
  }

  get ranks() {
    return this.organization.ranks as IOrganizationRank[];
  }

  get parentOrganization() {
    return this.organization.parentOrganization as IOrganization;
  }

  private onRankCreated = (rank: IOrganizationRank) => {
    if (this.organization.ranks) {
      this.organization.ranks.push(rank);
    }
  };

  toggleManageOrganization() {
    // todo
  }

  createRank(rank: IOrganizationRankCreate) {
    if (this.organization.id) {
      rank.organizationId = this.organization.id;
      this.rageClientService.callServer<IOrganizationRank>(ProcedureKey.SERVER_CREATE_ORGANIZATION_RANK, rank)
        .subscribe({ next: this.onRankCreated });
    }
  }

  onMapInit(map: L.Map) {
    L.marker([this.organization.position!.x, this.organization.position!.y]).addTo(map);

    map.dragging.disable();
    map.touchZoom.disable();
    map.scrollWheelZoom.disable();
    //map.setView([this.organization.position!.x, this.organization.position!.y], 3);
  }
}


