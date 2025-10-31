import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { AccountService } from '../../../core/service/account.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Button,
    Password
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialogRef: DynamicDialogRef, private accountService: AccountService) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchPasswordValidator.bind(this)]]
    });
  }

  private matchPasswordValidator(control: FormControl) {
    if (this.form) {
      return control.value === this.form.get('password')?.value ? null : { passwordMismatch: true };
    }
    return null;
  }

  submit() {
    if (this.form.valid) {
      const password = this.form.get('password')?.value;

      this.accountService.changePassword(password)
        .subscribe({ next: () => this.dialogRef.close() });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
