import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { eyeColors, faceFeatureNames, hairColors } from '@bcrp-rage/common';
import { CharacterAppearanceForm } from '../../../../domain/model/character';

@Component({
  selector: 'app-face-feature',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SliderModule],
  templateUrl: './face-feature.component.html',
  styleUrl: './face-feature.component.css'
})
export class FaceFeatureComponent {
  private readonly _eyeColor = 'eyeColor';
  public readonly _faceFeature = 'faceFeature';
  protected readonly faceFeatureNames = faceFeatureNames;
  protected readonly eyeColors = eyeColors;

  @Input() appearanceFormGroup!: FormGroup<CharacterAppearanceForm>;

  get selectedEyeColor() {
    return this.appearanceFormGroup.get(this._eyeColor)?.value;
  }

  getFormControl(idx: number) {
    const formArray = this.appearanceFormGroup.get(this._faceFeature) as FormArray<FormControl<number>>;
    return formArray.at(idx);
  }

  getEyeColor(idx: number) {
    return hairColors[idx];
  }

  setEyeColor(color: number) {
    this.appearanceFormGroup.get(this._eyeColor)?.setValue(color);
  }
}
