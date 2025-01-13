import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { BloodType, CharacterGender } from '@revolt-rp/common';
import { CreateCharacterForm } from '../../../../domain/model/character';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [CommonModule, InputTextModule, ReactiveFormsModule, CalendarModule, DropdownModule, SelectButtonModule, TooltipModule],
  templateUrl: './character-details.component.html',
  styleUrl: './character-details.component.css'
})
export class CharacterDetailsComponent {
  @Input() characterCreateForm !: FormGroup<CreateCharacterForm>;

  bloodTypes = Object.values(BloodType);
  genders: { label: string, icon: string, value: CharacterGender }[] = [
    {
      label: 'Male',
      value: CharacterGender.MALE,
      icon: 'pi pi-mars'
    },
    {
      label: 'Female',
      value: CharacterGender.FEMALE,
      icon: 'pi pi-venus'
    }
  ]
}
