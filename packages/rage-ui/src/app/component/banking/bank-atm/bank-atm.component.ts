import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputOtpModule } from 'primeng/inputotp';
import { IBankAccount, IBankCardInfo, IBankInteraction, IItem, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { fadeInOutTrigger } from '../../../domain/util/animation.util';
import { InputMaskModule } from 'primeng/inputmask';
import { playAudio } from '../../../domain/util/audio.util';
import { MessageService } from 'primeng/api';
import { BankActionInputComponent, BankActionOutput, BankActionType } from '../bank-menu/component/bank-action-input';
import { BANK_API_EVENTS } from '../../../domain/config/bank-api.config';
import { DialogService } from 'primeng/dynamicdialog';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-bank-atm',
  standalone: true,
  imports: [CommonModule, InputOtpModule, FormsModule, Button, TranslatePipe, InputMaskModule, ButtonDirective, StyleClassModule],
  providers: [DialogService],
  templateUrl: './bank-atm.component.html',
  styleUrl: './bank-atm.component.css',
  animations: [fadeInOutTrigger]
})
export class BankAtmComponent implements OnInit, OnDestroy {
  bankAccount: IBankAccount | null = null;
  bankCardInfo: IBankCardInfo | null = null;
  pinCodeInput: string | null = null;
  pinInvalid = false;

  constructor(private rageClientService: RageClientService, private messageService: MessageService, private translateService: TranslateService,
              private dialogService: DialogService) {
  }

  get isValidPin() {
    return this.pinCodeInput && this.pinCodeInput.length === 4;
  }

  get isValidCard() {
    return this.bankCardInfo && this.bankCardInfo.active;
  }

  private initializeAtm = (item: IItem) => {
    if (item && item.bankCardInfo) {
      this.bankCardInfo = item.bankCardInfo;
    }
  };

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_ATM_INIT, this.initializeAtm);
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_ATM_INIT, this.initializeAtm);
  }

  private handleBankError = (error: Error) => {
    playAudio('assets/audio/error-126627.mp3');
    this.messageService.add({
      severity: 'error',
      summary: this.translateService.instant('error'),
      detail: error.message
    });
  };

  submitAuthentication() {
    if (!this.isValidCard)
      return this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('error'),
        detail: this.translateService.instant('bank_card_not_active')
      });

    if (this.bankCardInfo && this.isValidPin && this.bankCardInfo.pinCode === this.pinCodeInput) {
      this.rageClientService.callServer<IBankAccount>(ProcedureKey.SERVER_PLAYER_BANK_GET_ACCOUNT, this.bankCardInfo.bankAccountNo)
        .subscribe({
          next: (bankAccount) => this.bankAccount = bankAccount
        });
    } else {
      this.pinInvalid = true;
    }
  }

  private updateBankAccount = (bankAccount: IBankAccount) => {
    this.bankAccount = bankAccount;
    playAudio('assets/audio/success-126629.mp3');
  };

  makeAction(actionType: BankActionType) {
    const dialogRef = this.dialogService.open(BankActionInputComponent, {
      header: this.translateService.instant(actionType),
      data: actionType,
      width: '20%',
      // focusOnClose: false, // TODO: Fix focus issue with dialog
      focusOnShow: false
    });

    dialogRef.onClose.subscribe((result?: BankActionOutput) => {
      if (result) {
        if (this.bankAccount && this.bankAccount.id) {
          const bankInteraction: IBankInteraction = {
            type: 'atm',
            bankAccountId: this.bankAccount.id,
            ...result
          };

          this.rageClientService.callServer<IBankAccount>(BANK_API_EVENTS[actionType], bankInteraction)
            .subscribe({ next: this.updateBankAccount, error: this.handleBankError });
        }
      }
    });
  }

  closeAtm() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_CLOSE_ATM);
  }

  protected readonly BankActionType = BankActionType;
}
