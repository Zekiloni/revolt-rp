import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CharacterAppearanceForm } from '../../../../domain/model/character';

@Component({
  selector: 'app-facial-hair',
  standalone: true,
  imports: [CommonModule, SliderModule, ReactiveFormsModule],
  templateUrl: './facial-hair.component.html',
  styleUrl: './facial-hair.component.css'
})
export class FacialHairComponent {
  @Input() appearanceFormGroup!: FormGroup<CharacterAppearanceForm>;
}
