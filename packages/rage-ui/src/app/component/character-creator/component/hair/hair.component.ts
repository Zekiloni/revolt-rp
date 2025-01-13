import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SliderModule } from 'primeng/slider';
import { DropdownModule } from 'primeng/dropdown';
import { CharacterGender, hairColors, hairStyleNames, hairStyles } from '@revolt-rp/common';
import { CharacterAppearanceForm } from '../../../../domain/model/character';

@Component({
  selector: 'app-hair',
  standalone: true,
  imports: [CommonModule, SliderModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './hair.component.html',
  styleUrl: './hair.component.css'
})
export class HairComponent implements OnInit, OnChanges {
  protected readonly hairColors = hairColors;
  private readonly _hairColor = 'hairColor';
  private readonly _hairHighlightColor = 'hairHighlightColor';

  @Input() gender!: CharacterGender;
  @Input() appearanceFormGroup!: FormGroup<CharacterAppearanceForm>;

  availableHairStyles: { label: string, value: number }[] = [];

  ngOnInit() {
    this.loadHairStyles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gender'] && !changes['gender'].firstChange) {
      this.loadHairStyles();
    }
  }

  loadHairStyles() {
    this.availableHairStyles = hairStyles[this.gender].map((hairStyle) => ({
      value: hairStyle,
      label: hairStyleNames[this.gender][hairStyle]
    }));
  }

  get hairColor() {
    return this.appearanceFormGroup.get(this._hairColor)?.value as number;
  }

  set hairColor(value: number) {
    this.appearanceFormGroup.get(this._hairColor)?.setValue(value);
  }

  get hairHighlightColor() {
    return this.appearanceFormGroup.get(this._hairHighlightColor)?.value as number;
  }

  set hairHighlightColor(value: number) {
    this.appearanceFormGroup.get(this._hairHighlightColor)?.setValue(value);
  }
}
