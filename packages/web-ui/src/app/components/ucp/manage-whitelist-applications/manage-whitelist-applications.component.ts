import { Component, ViewChild } from '@angular/core';
import { WhitelistService } from '../../../core/service/whitelist.service';
import { IAccount, IWhitelist, WhitelistStatus } from '@revolt-rp/common';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ReviewWhitelistApplicationComponent } from '../review-whitelist-application';
import { Tag } from 'primeng/tag';
import { getWhitelistStatusLabel, getWhitelistStatusSeverity } from '../../../core/util/whitelist.util';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-manage-whitelist-applications',
  imports: [
    TableModule,
    DatePipe,
    DropdownModule,
    FormsModule,
    Tag,
    Button
  ],
  providers: [DialogService, WhitelistService],
  templateUrl: './manage-whitelist-applications.component.html',
  styleUrl: './manage-whitelist-applications.component.css'
})
export class ManageWhitelistApplicationsComponent {
  @ViewChild('applicationsTable') applicationsTable!: Table;

  readonly whitelistStatusOptions = Object.values(WhitelistStatus);

  protected readonly getWhitelistStatusSeverity = getWhitelistStatusSeverity;
  protected readonly getWhitelistStatusLabel = getWhitelistStatusLabel;

  limit = 50;

  offset = 0;
  total = 0;
  applications: IWhitelist[] = [];
  loading = true;

  constructor(
    private dialogService: DialogService,
    private whitelistService: WhitelistService) {
  }

  get isPendingFilter(): boolean {
    const statusFilter = this.applicationsTable?.filters?.['status'];
    if (statusFilter) {
      const statusArray = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
      return statusArray[0].value === WhitelistStatus.PENDING;
    }
    return false;
  }

  getWhitelistApplications(event: TableLazyLoadEvent) {
    this.limit = event.rows ?? this.limit;
    this.offset = event.first ?? this.offset;
    this.loading = true;

    let statusFilterValue: WhitelistStatus | undefined = undefined;
    const statusFilter = event.filters?.['status'];
    if (statusFilter) {
      const statusArray = Array.isArray(statusFilter) ? statusFilter : [statusFilter];
      statusFilterValue = statusArray[0].value;
    }

    this.whitelistService.getAllWhitelists(statusFilterValue, this.limit, this.offset).subscribe({
      next: (res) => {
        this.applications = res.whitelists;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onApplicationSelect(whitelist: IWhitelist) {
    this.dialogService.open(ReviewWhitelistApplicationComponent, {
      header: `Whitelist Application - ${(<IAccount>whitelist.account).username}`,
      width: '50%',
      modal: true,
      closable: true,
      maximizable: true,
      closeOnEscape: true,
      dismissableMask: true,
      data: whitelist
    }).onClose.subscribe((approved: boolean) => {
      if (approved) {
        this.getWhitelistApplications(this.applicationsTable.createLazyLoadMetadata());
      }
    });
  }
}
