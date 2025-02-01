import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { Button } from 'primeng/button';


export enum BankActionType {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
  Transfer = 'transfer',
}

export interface BankActionOutput {
  amount: number;
  targetAccountNumber: string | null;
}

@Component({
  selector: 'app-bank-action-input',
  standalone: true,
  imports: [CommonModule, DropdownModule, TranslatePipe, InputTextModule, FormsModule, InputNumberModule, InputMaskModule, Button],
  templateUrl: './bank-action-input.component.html',
  styleUrl: './bank-action-input.component.css'
})
export class BankActionInputComponent {
  amount: number | null = null;
  targetBankAccount: string | null = null;
  actionType: BankActionType;

  constructor(dialogConfig: DynamicDialogConfig, private dynamicDialogRef: DynamicDialogRef) {
    this.actionType = dialogConfig.data;
  }

  protected readonly BankActionType = BankActionType;

  submitAction() {
    this.dynamicDialogRef.close({ amount: this.amount, targetAccountNumber: this.targetBankAccount });
  }

  isActionValid() {
    return this.amount && (this.actionType !== BankActionType.Transfer || this.targetBankAccount);
  }
}
