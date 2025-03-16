import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-bank-phone-link',
  standalone: true,
  imports: [CommonModule, Button, InputNumberModule, TranslatePipe, InputTextModule, FormsModule],
  templateUrl: './bank-phone-link.component.html',
  styleUrl: './bank-phone-link.component.css'
})
export class BankPhoneLinkComponent {
  phoneNumber = '';

  constructor(private dialogConfig: DynamicDialogConfig, private dialogRef: DynamicDialogRef) {
    this.phoneNumber = this.dialogConfig.data;
  }


  get isInValidPhoneNumber() {
    return !this.phoneNumber || !/^\d+$/.test(this.phoneNumber);
  }

  submit() {
    this.dialogRef.close(this.phoneNumber);
  }
}
