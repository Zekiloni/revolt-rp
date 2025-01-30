import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateSavingAccountComponent } from './component/create-saving-account';
import { ManageBankAccountsComponent } from './component/manage-bank-accounts';

@Component({
  selector: 'app-bank-menu',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  providers: [DialogService],
  templateUrl: './bank-menu.component.html',
  styleUrl: './bank-menu.component.css'
})
export class BankMenuComponent {

  constructor(private rageClientService: RageClientService, private dialogService: DialogService, private translateService: TranslateService) {
  }

  closeMenu() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_TOGGLE_BANK_MENU, false);
  }

  manageBankAccounts() {
    this.dialogService.open(ManageBankAccountsComponent, {
      header: this.translateService.instant('bank_menu.my_accounts'),
      width: '45%',
      height: '55%',
      focusOnShow: false
    });
  }

  createSavingAccount() {
    this.dialogService.open(CreateSavingAccountComponent, {
      header: this.translateService.instant('bank_menu.open_savings_account')
    });
  }
}
