import { Component, ViewChild } from '@angular/core';
import { WhitelistService } from '../../../core/service/whitelist.service';
import { IAccount, IWhitelist, WhitelistStatus } from '@revolt-rp/common';
import { Table, TableLazyLoadEvent, TableModule, TableRowSelectEvent } from 'primeng/table';
import { DatePipe, SlicePipe } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ReviewWhitelistApplicationComponent } from '../review-whitelist-application';
import { Tag } from 'primeng/tag';
import { getWhitelistStatusLabel, getWhitelistStatusSeverity } from '../../../core/util/whitelist.util';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-manage-whitelist-applications',
  imports: [
    TableModule,
    DatePipe,
    DropdownModule,
    FormsModule,
    Tag,
    SlicePipe,
    Tooltip
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

  selectedApplication!: IWhitelist;

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

  onApplicationSelect(event: TableRowSelectEvent<IWhitelist>) {
    const app = event.data as IWhitelist;
    this.dialogService.open(ReviewWhitelistApplicationComponent, {
      header: `Whitelist Application - ${(<IAccount>app.account).username}`,
      width: '50%',
      modal: true,
      closable: true,
      maximizable: true,
      closeOnEscape: true,
      dismissableMask: true,
      data: app
    }).onClose.subscribe((approved: boolean) => {
      if (approved) {
        this.getWhitelistApplications(this.applicationsTable.createLazyLoadMetadata());
      }
    });

    this.onApplicationUnselect();
  }

  onApplicationUnselect() {
    if (this.applicationsTable) {
      this.applicationsTable.selection = null;
    }
  }
}
