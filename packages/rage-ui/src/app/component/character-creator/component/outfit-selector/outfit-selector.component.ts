import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CharacterGender, defaultOutfits } from '@revolt-rp/common';
import { CreateCharacterForm } from '../../../../domain/model/character';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-outfit-selector',
  standalone: true,
  imports: [CommonModule, RadioButtonModule, FormsModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './outfit-selector.component.html',
  styleUrl: './outfit-selector.component.css',
})
export class OutfitSelectorComponent {
  private readonly _gender = 'gender';
  @Input() createCharacterForm!: FormGroup<CreateCharacterForm>;

  get gender() {
    return this.createCharacterForm.get(this._gender)?.value as CharacterGender;
  }

  get outfits() {
    return defaultOutfits[this.gender];
  }
}
