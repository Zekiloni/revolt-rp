import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderChangeEvent, SliderModule } from 'primeng/slider';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CharacterGender, hairStyleNames, hairStyles } from '@bcrp-rage/common';
import { CharacterAppearanceForm } from '../../../../domain/model/character';

@Component({
  selector: 'app-facial-hair',
  standalone: true,
  imports: [CommonModule, SliderModule, ReactiveFormsModule],
  templateUrl: './facial-hair.component.html',
  styleUrl: './facial-hair.component.css'
})
export class FacialHairComponent {
  private readonly _hairStyle = 'hairStyle';

  @Input() gender!: CharacterGender;
  @Input() appearanceFormGroup!: FormGroup<CharacterAppearanceForm>;

  get hairStyles() {
    return this.gender == CharacterGender.MALE ? hairStyles.male : hairStyles.female;
  }

  getHairStyleName(hairStyle: number) {
    return this.gender == CharacterGender.MALE ?
      hairStyleNames.male[hairStyle] : hairStyleNames.female[hairStyle];
  }

  handleHairStyleChange(event: SliderChangeEvent) {
    this.appearanceFormGroup.get(this._hairStyle)?.setValue(this.hairStyles[(<number>event.value)]);
  }
}
