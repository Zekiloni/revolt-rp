import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IPropertyVehicleCreate,
  rgbColors,
  vehicleModels,
} from '@revolt-rp/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    AutoCompleteModule,
    Button,
    InputNumberModule,
    PaginatorModule,
    ReactiveFormsModule,
    TranslatePipe,
    InputTextModule,
    ColorPickerModule,
  ],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.css',
})
export class AddVehicleComponent {
  @Output() cancelAddVehicle = new EventEmitter<void>();
  @Output() submitAddVehicle = new EventEmitter<IPropertyVehicleCreate>();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  get color() {
    return this.form.get('color') as FormArray;
  }

  vehicleModels = vehicleModels;
  filteredModels: string[] = [];

  initialColors: [number, number, number][] = [
    [255, 0, 0],
    [0, 255, 0],
  ];

  private buildForm() {
    this.form = this.formBuilder.group({
      model: ['', [Validators.required]],
      limit: ['', [Validators.required]],
      color: this.formBuilder.array(
        this.initialColors.map((rgb) => this.formBuilder.control(rgb))
      ),
    });
  }

  searchModels(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    this.filteredModels = this.vehicleModels.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }

  submit() {
    if (this.form.invalid) return;

    const vehicle = this.form.value;
    this.submitAddVehicle.emit(vehicle);
  }
}
