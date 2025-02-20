import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationPermissionType } from '@revolt-rp/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button, ButtonDirective } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslatePipe } from '@ngx-translate/core';
import { ChipsModule } from 'primeng/chips';

@Component({
  selector: 'app-create-rank',
  standalone: true,
  imports: [CommonModule, Button, DropdownModule, InputNumberModule, TranslatePipe, ReactiveFormsModule, ChipsModule, ButtonDirective],
  templateUrl: './create-rank.component.html',
  styleUrl: './create-rank.component.css'
})
export class CreateRankComponent {
  public MIN_NAME_LENGTH = 4;
  public MAX_NAME_LENGTH = 24;

  createRankFormGroup!: FormGroup;

  rankPermissions = Object.values(OrganizationPermissionType);

  constructor(private formBuilder: FormBuilder, private dialogRef: DynamicDialogRef) {
    this.createRankFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(this.MIN_NAME_LENGTH), Validators.maxLength(this.MAX_NAME_LENGTH)]],
      permissions: [OrganizationPermissionType.NORMAL, [Validators.required]]
    });
  }

  get isFormInvalid() {
    return this.createRankFormGroup.invalid;
  }

  submitCreateRankForm() {
    if (this.isFormInvalid)
      return;

    this.dialogRef.close(this.createRankFormGroup.value);
  }
}
