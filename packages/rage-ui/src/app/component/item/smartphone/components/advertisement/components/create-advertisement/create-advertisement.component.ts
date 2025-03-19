import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdvertisementCategory, IAdvertisementCreate } from '@revolt-rp/common';
import { ButtonDirective } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputNumberModule } from 'primeng/inputnumber';


@Component({
  selector: 'app-create-advertisement',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule, ReactiveFormsModule, TranslatePipe, DropdownModule, ButtonDirective, ToggleButtonModule, InputNumberModule],
  templateUrl: './create-advertisement.component.html',
  styleUrl: './create-advertisement.component.css'
})
export class CreateAdvertisementComponent {
  MIN_LENGTH = 10;
  MAX_LENGTH = 512;

  @Output() createAdvertisement = new EventEmitter<IAdvertisementCreate>();

  form!: FormGroup;

  categories = Object.values(AdvertisementCategory);

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      public: [true, Validators.required],
      category: [null, Validators.required, Validators.maxLength(this.MAX_LENGTH), Validators.minLength(this.MIN_LENGTH)],
      content: [null, Validators.required],
      price: [null]
    });
  }

  submit() {
    if (this.form.invalid)
      return;

    this.createAdvertisement.emit(this.form.value);
  }
}
