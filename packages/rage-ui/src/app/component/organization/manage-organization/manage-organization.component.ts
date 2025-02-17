import { Types } from 'mongoose';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { TabViewModule } from 'primeng/tabview';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IOrganization, IOrganizationRank, OrganizationPermissionType, OrganizationType } from '@revolt-rp/common';
import { ManageRanksComponent } from './components/manage-ranks/manage-ranks.component';


@Component({
  selector: 'app-manage-organization',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslatePipe, TabViewModule, ColorPickerModule, ReactiveFormsModule, FormsModule, ManageRanksComponent],
  templateUrl: './manage-organization.component.html',
  styleUrl: './manage-organization.component.css'
})
export class ManageOrganizationComponent {
  isActive = true;

  organization: Partial<IOrganization> = {
    name: 'Organization Name',
    shortName: 'ORG',
    type: OrganizationType.Company,
    createdAt: new Date(),
    ranks: [
      { name: 'Rank 1', salary: 100, permission: OrganizationPermissionType.MANAGE_ORGANIZATION, id: '342423', _id: new Types.ObjectId() },
      { name: 'Rank 1', salary: 43, permission: OrganizationPermissionType.NORMAL, id: '342423', _id: new Types.ObjectId() },
    ]
  };


  get ranks() {
    return this.organization.ranks as IOrganizationRank[];
  }

  get parentOrganization() {
    return this.organization.parentOrganization as IOrganization;
  }

  toggleManageOrganization() {
    // todo
  }
}
