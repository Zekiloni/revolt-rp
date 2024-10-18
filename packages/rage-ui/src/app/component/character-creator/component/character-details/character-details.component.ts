import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CreateCharacterForm } from '../../../../domain/model/character';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [CommonModule, InputTextModule, ReactiveFormsModule, CalendarModule],
  templateUrl: './character-details.component.html',
  styleUrl: './character-details.component.css'
})
export class CharacterDetailsComponent {
  @Input() characterCreateForm !: FormGroup<CreateCharacterForm>;
}
