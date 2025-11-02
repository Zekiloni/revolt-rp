import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IAccount, IWhitelist, WhitelistStatus } from '@revolt-rp/common';
import { WhitelistService } from '../../../core/service/whitelist.service';
import { Tag } from 'primeng/tag';
import { getWhitelistStatusLabel, getWhitelistStatusSeverity } from '../../../core/util/whitelist.util';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-review-whitelist-application',
  standalone: true,
  imports: [
    DatePipe,
    Button,
    Tag,
    ConfirmPopup,
    FormsModule,
    AccordionModule,
    InputText
  ],
  providers: [ConfirmationService, WhitelistService],
  templateUrl: './review-whitelist-application.component.html',
  styleUrl: './review-whitelist-application.component.css'
})
export class ReviewWhitelistApplicationComponent {
  note = '';

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private whitelistService: WhitelistService) {

    if (!this.isPending && this.application.note) {
      this.note = this.application.note;
    }
  }

  get application() {
    return this.dialogConfig.data as IWhitelist;
  }

  get account() {
    return this.application.account as IAccount;
  }

  get isPending() {
    return this.application.status === WhitelistStatus.PENDING;
  }

  cancel() {
    this.dialogRef.close();
  }

  approveApplication() {
    this.whitelistService.approveWhitelist(this.application.id)
      .subscribe({ next: () => this.dialogRef.close(true) });
  }

  rejectApplication(event: MouseEvent) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Please confirm to proceed moving forward.',
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        icon: 'pi pi-times',
        label: 'Cancel',
        outlined: true,
      },
      acceptButtonProps: {
        icon: 'pi pi-check',
        label: 'Confirm',
      },
      accept: () => {
        this.whitelistService.rejectWhitelist(this.application.id, this.note)
          .subscribe({ next: () => this.dialogRef.close(true) });
      },
    });
  }

  protected readonly getWhitelistStatusSeverity = getWhitelistStatusSeverity;
  protected readonly getWhitelistStatusLabel = getWhitelistStatusLabel;
}
