import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonDirective } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CommercialType,
  gameUiConfig,
  GameUiKey,
  IPropertyCreate,
  ProcedureKey,
  PropertyType
} from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';

@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslatePipe, InputTextModule, ReactiveFormsModule, DropdownModule, ButtonDirective, InputNumberModule],
  templateUrl: './create-property.component.html',
  styleUrl: './create-property.component.css'
})
export class CreatePropertyComponent {
  @Input() isActive: boolean = gameUiConfig.createProperty.isActive;

  propertyTypes = Object.values(PropertyType);
  commercialTypes = Object.values(CommercialType);

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private rageClientService: RageClientService) {
    this.buildForm();
  }

  get isCommercialType() {
    return this.form.get('type')?.value === PropertyType.Commercial;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: [null, []],
      type: [null, [Validators.required]],
      price: [null]
    });

    this.form.get('type')?.valueChanges.subscribe((value) => {
      if (value === 'commercial') {
        this.form.addControl('subType', this.formBuilder.control(null, [Validators.required]));
      } else {
        this.form.removeControl('subType');
      }
    });
  };


  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.CreateProperty);
  }

  submit() {
    const property: IPropertyCreate = this.form.value;
    this.rageClientService.triggerServer(ProcedureKey.SERVER_PROPERTY_CREATE, property);
  }
}
