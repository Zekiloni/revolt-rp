import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProperty, IPropertyUpdate } from '@revolt-rp/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { ManageInteractionPointsComponent } from '../manage-interaciton-points';


@Component({
  selector: 'app-property-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, InputTextModule, ButtonDirective, ManageInteractionPointsComponent],
  templateUrl: './property-settings.component.html',
  styleUrl: './property-settings.component.css'
})
export class PropertySettingsComponent implements OnInit {
  @Input() property!: IProperty;
  @Output() updateProperty = new EventEmitter<IPropertyUpdate>();

  form!: FormGroup;
  anyChanges = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: [this.property.name, [Validators.required]]
    });

    this.form.valueChanges.subscribe(() => {
      this.anyChanges = true;
    });
  }

  submit() {
    if (!this.anyChanges)
      return;

    if (this.form.invalid)
      return;

    const propertyUpdate: IPropertyUpdate = {
      id: this.property.id,
      ...this.form.value
    };

    this.updateProperty.emit(propertyUpdate);
    this.anyChanges = false;
  }
}
