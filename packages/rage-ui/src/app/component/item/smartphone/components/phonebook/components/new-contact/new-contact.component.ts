import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPhoneContactCreate } from '@revolt-rp/common';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';


@Component({
  selector: 'app-new-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, TranslatePipe, ButtonDirective, CheckboxModule],
  templateUrl: './new-contact.component.html',
  styleUrl: './new-contact.component.css'
})
export class NewContactComponent {
  @Output() contactCreate = new EventEmitter<IPhoneContactCreate>();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      favorite: [false]
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.contactCreate.emit(this.form.value);
  }
}
