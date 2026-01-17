import { Component, Input, ViewChild } from '@angular/core';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IBan, IKick } from '@revolt-rp/common';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { AccountService } from '../../../core/service/account.service';


@Component({
  selector: 'app-moderation-log',
  standalone: true,
  imports: [
    TableModule,
    SelectButton,
    FormsModule,
    DatePipe
  ],
  providers: [AccountService],
  templateUrl: './moderation-log.component.html',
  styleUrl: './moderation-log.component.css'
})
export class ModerationLogComponent {
  @Input() accountId!: string;

  @ViewChild('moderationTable') moderationTable!: Table;

  options = ['kicks', 'bans'];
  selectedTab: 'kicks' | 'bans' = 'kicks';

  elements: (IKick | IBan)[] = [];
  totalElements = 0;

  limit = 50;
  offset = 0;

  constructor(private accountService: AccountService) {
  }


  loadKicks() {
    this.accountService.getAccountKickLogs(this.accountId, this.limit, this.offset).subscribe((response) => {
      this.elements = response.kicks;
      this.totalElements = response.total;
    });
  }

  loadBans() {
    this.accountService.getAccountBanLogs(this.accountId, this.limit, this.offset).subscribe((response) => {
      this.elements = response.bans;
      this.totalElements = response.total;
      console.log('bans loaded', response);
    });
  }

  loadElements($event: TableLazyLoadEvent) {
    this.limit = $event.rows ?? this.limit;
    this.offset = $event.first ?? this.offset;

    if (this.selectedTab === 'kicks') {
      this.loadKicks();
    } else {
      this.loadBans();
    }
  }

  onTabChange() {
    console.log('tab changed to', this.selectedTab);
    this.loadElements(this.moderationTable.createLazyLoadMetadata());
  }
}
