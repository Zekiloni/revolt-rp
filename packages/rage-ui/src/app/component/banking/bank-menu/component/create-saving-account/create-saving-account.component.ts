import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-saving-account',
  standalone: true,
  imports: [CommonModule, InputNumberModule, TranslatePipe, FormsModule, Button],
  templateUrl: './create-saving-account.component.html',
  styleUrl: './create-saving-account.component.css'
})
export class CreateSavingAccountComponent {
  amount: null | number = null;

  constructor(private dialogRef: DynamicDialogRef) {
  }

  isValidAmount() {
    return this.amount && this.amount > 0;
  }

  submitCreateSavingAccount() {
    this.dialogRef.close(this.amount);
  }
}
