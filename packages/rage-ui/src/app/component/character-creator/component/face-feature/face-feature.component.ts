import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { faceFeatureNames } from '@bcrp-rage/common';
import { CharacterAppearanceForm } from '../../../../domain/model/character';

@Component({
  selector: 'app-face-feature',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SliderModule],
  templateUrl: './face-feature.component.html',
  styleUrl: './face-feature.component.css'
})
export class FaceFeatureComponent {
  protected readonly faceFeatureNames = faceFeatureNames;
  public readonly _faceFeature = 'faceFeature';

  @Input() appearanceFormGroup!: FormGroup<CharacterAppearanceForm>;

  getFormControl(idx: number) {
    const formArray = this.appearanceFormGroup.get(this._faceFeature) as FormArray<FormControl<number>>;
    return formArray.at(idx);
  }
}
