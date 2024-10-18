import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { ChipsModule } from 'primeng/chips';
import { CharacterCreate, ProcedureKey } from '@bcrp-rage/common';
import { CreateCharacterForm, characterCreateFormConfig } from '../../domain/model/character';
import { CharacterDetailsComponent } from './component/character-details';
import { RageClientService } from '../../domain/service/rage-client.service';


@Component({
  selector: 'app-character-creator',
  standalone: true,
  imports: [CommonModule, Button, StepperModule, ChipsModule, CharacterDetailsComponent, ReactiveFormsModule],
  providers: [RageClientService],
  templateUrl: './character-creator.component.html',
  styleUrl: './character-creator.component.css'
})
export class CharacterCreatorComponent {
  activeStepIdx: number = 0;
  createCharacterForm!: FormGroup<CreateCharacterForm>;

  constructor(private formBuilder: FormBuilder, private rageClientService: RageClientService) {
    this.buildCreateCharacterForm();
  }

  private buildCreateCharacterForm() {
    this.createCharacterForm = characterCreateFormConfig(this.formBuilder);
  }

  submitCreateCharacterForm() {
    const characterCreate: CharacterCreate = this.createCharacterForm.getRawValue() as CharacterCreate;
    this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_CREATE_CHARACTER, characterCreate);
  }
}
