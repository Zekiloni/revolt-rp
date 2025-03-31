import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { IProductAdd } from '@revolt-rp/common';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, Button, TranslatePipe, InputTextModule, ReactiveFormsModule, InputNumberModule, AutoCompleteModule, DropdownModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  @Input() availableItems: string[] = [];

  @Output() cancelAddProduct = new EventEmitter<void>();
  @Output() submitAddProduct = new EventEmitter<IProductAdd>();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  filterItems(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    this.availableItems = this.availableItems.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  }

  submit() {
    if (this.form.invalid)
      return;

    const product = this.form.value;
    this.submitAddProduct.emit(product);
  }
}
