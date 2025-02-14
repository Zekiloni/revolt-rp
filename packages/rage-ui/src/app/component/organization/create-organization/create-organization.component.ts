import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Button, ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { gameUiConfig, GameUiKey, hexColors, IOrganization, OrganizationType, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';

@Component({
  selector: 'app-create-organization',
  standalone: true,
  imports: [CommonModule, DialogModule, Button, InputTextModule, TranslatePipe, ReactiveFormsModule, ColorPickerModule, DropdownModule, ButtonDirective],
  templateUrl: './create-organization.component.html',
  styleUrl: './create-organization.component.css'
})
export class CreateOrganizationComponent implements OnInit {
  @Input() isActive = gameUiConfig.createOrganization.isActive;
  organizationTypes = Object.values(OrganizationType);
  availableOrganizations: IOrganization[] = [];
  loadingOrganizations = true;

  createOrganizationFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private rageClientService: RageClientService) {
    this.createOrganizationFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      shortName: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      color: new FormControl(`#${hexColors.MEDIUM_SPRING_GREEN}`, [Validators.required]),
      parentOrganization: new FormControl<IOrganization | undefined>(undefined, [Validators.required])
    });
  }

  submitCreateOrganization() {
    this.createOrganizationFormGroup.markAllAsTouched();

    if (this.createOrganizationFormGroup.invalid)
      return;

    this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_CREATE_ORGANIZATION, this.createOrganizationFormGroup.value);
  }

  cancelCreateOrganization() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.CreateOrganization);
  }

  private setAvailableOrganizations = (organizations: IOrganization[]) => {
    this.availableOrganizations = organizations;
    this.loadingOrganizations = false;
  };

  ngOnInit(): void {
    this.rageClientService.callServer<IOrganization[]>(ProcedureKey.SERVER_PLAYER_GET_ORGANIZATIONS)
      .subscribe({ next: this.setAvailableOrganizations });
  }
}
