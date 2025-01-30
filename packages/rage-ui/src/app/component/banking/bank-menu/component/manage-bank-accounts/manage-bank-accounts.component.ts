import { Component } from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabViewModule } from 'primeng/tabview';
import { BankAccountType, IBankAccount } from '@revolt-rp/common';
import mongoose from 'mongoose';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TransactionHistoryComponent } from '../transaction-history';

@Component({
  selector: 'app-manage-bank-accounts',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, TabViewModule, DropdownModule, FormsModule, TranslatePipe, TransactionHistoryComponent],
  templateUrl: './manage-bank-accounts.component.html',
  styleUrl: './manage-bank-accounts.component.css'
})
export class ManageBankAccountsComponent {
  bankAccounts: IBankAccount[] = [
    {
      character: undefined,
      number: '3424-3242-6578-7765',
      balance: 34254,
      type: BankAccountType.Main,
      _id: new mongoose.Types.ObjectId(),
      id: new mongoose.Types.ObjectId().toString()
    },
    {
      character: undefined,
      number: '2343-3242-4353-7765',
      balance: 342,
      type: BankAccountType.Savings,
      _id: new mongoose.Types.ObjectId(),
      id: new mongoose.Types.ObjectId().toString()
    }
  ];

  selectedBankAccount: IBankAccount | null = null;
  activeIndex = 0;

  constructor() {
    this.selectedBankAccount = this.getBankAccountByType(BankAccountType.Main) ?? null;
  }

  getBankAccountByType(type: BankAccountType) {
    return this.bankAccounts.find(bankAccount => bankAccount.type === type);
  }

  protected readonly formatCurrency = formatCurrency;
}
