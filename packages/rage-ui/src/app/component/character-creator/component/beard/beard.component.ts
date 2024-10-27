import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CharacterAppearanceForm } from '../../../../domain/model/character';
import { beardStyleNames, hairColors } from '@bcrp-rage/common';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-beard',
  standalone: true,
  imports: [CommonModule, DropdownModule, ReactiveFormsModule, SliderModule],
  templateUrl: './beard.component.html',
  styleUrl: './beard.component.css',
})
export class BeardComponent {
  protected readonly hairColors = hairColors;
  private _beardStyle = 'beardStyle';
  private _beardColor = 'beardColor';

  @Input() appearanceFormGroup!: FormGroup<CharacterAppearanceForm>;
  beardStyles: { label: string, value: number }[] = beardStyleNames.map((beardStyleName, i) => ({
    label: beardStyleName,
    value: i
  }));

  get beardColor() {
    return this.appearanceFormGroup.get(this._beardColor)?.value as number;
  }

  set beardColor(value: number) {
    this.appearanceFormGroup.get(this._beardColor)?.setValue(value);
  }

  clearBeardStyle() {
    this.appearanceFormGroup.get(this._beardStyle)?.setValue(255);
  }
}
