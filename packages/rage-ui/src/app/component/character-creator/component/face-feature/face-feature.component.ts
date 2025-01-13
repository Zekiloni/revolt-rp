import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { DropdownModule } from 'primeng/dropdown';
import { eyeColorNames, faceFeatureNames } from '@revolt-rp/common';
import { CharacterAppearanceForm } from '../../../../domain/model/character';

@Component({
  selector: 'app-face-feature',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SliderModule, DropdownModule],
  templateUrl: './face-feature.component.html',
  styleUrl: './face-feature.component.css'
})
export class FaceFeatureComponent {
  public readonly _faceFeature = 'faceFeature';
  protected readonly faceFeatureNames = faceFeatureNames;

  @Input() appearanceFormGroup!: FormGroup<CharacterAppearanceForm>;
  availableEyeColors: { label: string, value: number }[] = eyeColorNames.map((eyeColorName, index) => ({
    label: eyeColorName,
    value: index
  }));

  getFormControl(idx: number) {
    const formArray = this.appearanceFormGroup.get(this._faceFeature) as FormArray<FormControl<number>>;
    return formArray.at(idx);
  }
}
