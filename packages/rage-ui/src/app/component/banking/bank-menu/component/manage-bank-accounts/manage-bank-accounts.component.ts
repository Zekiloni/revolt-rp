import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabViewModule } from 'primeng/tabview';
import { BankAccountType, IBankAccount, IBankInteraction, ProcedureKey } from '@revolt-rp/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TransactionHistoryComponent } from '../transaction-history';
import { ButtonDirective } from 'primeng/button';
import { BankActionInputComponent, BankActionOutput, BankActionType } from '../bank-action-input';
import { DialogService } from 'primeng/dynamicdialog';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { MessageService } from 'primeng/api';
import { playAudio } from '../../../../../domain/util/audio.util';


const API_EVENTS = {
  [BankActionType.Deposit]: ProcedureKey.SERVER_PLAYER_DEPOSIT_MONEY,
  [BankActionType.Withdraw]: ProcedureKey.SERVER_PLAYER_WITHDRAW_MONEY,
  [BankActionType.Transfer]: ProcedureKey.SERVER_PLAYER_TRANSFER_MONEY
};

@Component({
  selector: 'app-manage-bank-accounts',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, TabViewModule, DropdownModule, FormsModule, TranslatePipe, TransactionHistoryComponent, ButtonDirective],
  providers: [DialogService],
  templateUrl: './manage-bank-accounts.component.html',
  styleUrl: './manage-bank-accounts.component.css'
})
export class ManageBankAccountsComponent {
  protected readonly BankActionType = BankActionType;

  bankAccounts: IBankAccount[] = [];

  selectedBankAccount: IBankAccount | null = null;
  activeIndex = 0;

  constructor(private dialogService: DialogService,
              private translateService: TranslateService,
              private rageClientService: RageClientService,
              private messageService: MessageService) {
    this.loadBankAccounts();
  }

  private loadBankAccounts() {
    this.rageClientService.callServer<IBankAccount[]>(ProcedureKey.SERVER_PLAYER_BANK_GET_ACCOUNTS)
      .subscribe({
        next: bankAccounts => {
          this.bankAccounts = bankAccounts;
          this.selectedBankAccount = this.getBankAccountByType(BankAccountType.Main) ?? null;
        }
      });
  }

  private updateBankAccount = (bankAccount: IBankAccount) => {
    this.bankAccounts = this.bankAccounts.map(account => account.id === bankAccount.id ? bankAccount : account);
    this.selectedBankAccount = bankAccount;
    playAudio('assets/audio/success-126629.mp3');
  };

  getBankAccountByType = (type: BankAccountType) => {
    return this.bankAccounts.find(bankAccount => bankAccount.type === type);
  };

  makeAction(actionType: BankActionType) {
    const dialogRef = this.dialogService.open(BankActionInputComponent, {
      header: this.translateService.instant(actionType),
      data: actionType,
      width: '20%',
      focusOnClose: false,
      focusOnShow: false
    });

    dialogRef.onClose.subscribe((result?: BankActionOutput) => {
      if (result) {
        if (this.selectedBankAccount) {
          const bankInteraction: IBankInteraction = {
            bankAccountId: this.selectedBankAccount.id,
            ...result
          };

          this.rageClientService.callServer<IBankAccount>(API_EVENTS[actionType], bankInteraction)
            .subscribe({ next: this.updateBankAccount, error: this.handleBankError });
        }
      }
    });
  }

  private handleBankError = (error: Error) => {
    playAudio('assets/audio/error-126627.mp3');
    this.messageService.add({ severity: 'error', summary: this.translateService.instant('error'), detail: error.message });
  };
}
