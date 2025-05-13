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
  gameUiConfig,
  GameUiKey, IProperty,
  IPropertyCreate,
  ProcedureKey, propertySubTypeMap,
  PropertyType, purchasablePropertyTypes
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
  propertySubTypes: string[] = [];

  properties: IProperty[] = [];

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private rageClientService: RageClientService) {
    this.buildForm();
    this.getProperties();
  }

  private getProperties() {
    this.rageClientService.callServer<IProperty[]>(ProcedureKey.SERVER_GET_PLAYER_PROPERTIES)
      .subscribe({ next: (properties) => this.properties = properties });
  }

  get isPurchasableType() {
    const type = this.form.get('type')?.value as PropertyType;
    return purchasablePropertyTypes.includes(type);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: [null, []],
      type: [null, [Validators.required]],
      price: [null],
      parentProperty: [null]
    });

    this.form.get('type')?.valueChanges.subscribe((value) => {
      const type = value as PropertyType;
      this.propertySubTypes = propertySubTypeMap[type] || [];

      const subTypeControlExists = this.form.contains('subType');
      if (this.propertySubTypes.length) {
        if (!subTypeControlExists) {
          this.form.addControl('subType', this.formBuilder.control(null, [Validators.required]));
        } else {
          this.form.get('subType')?.setValue(null);
        }
      } else if (subTypeControlExists) {
        this.form.removeControl('subType');
      }

      const priceControlExists = this.form.contains('price');
      if (purchasablePropertyTypes.includes(type)) {
        if (!priceControlExists) {
          this.form.addControl('price', this.formBuilder.control(null, [Validators.required]));
        }
      } else if (priceControlExists) {
        this.form.removeControl('price');
      }
    });
  };

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.CreateProperty);
  }

  submit() {
    if (this.form.invalid)
      return;

    const property: IPropertyCreate = this.form.value;
    this.rageClientService.triggerServer(ProcedureKey.SERVER_PROPERTY_CREATE, property);
  }
}
