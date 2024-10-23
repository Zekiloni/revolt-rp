import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { CharacterGender, ICharacterCreate, ProcedureKey } from '@bcrp-rage/common';
import { CreateCharacterForm, characterCreateFormConfig } from '../../domain/model/character';
import { CharacterDetailsComponent } from './component/character-details';
import { RageClientService } from '../../domain/service/rage-client.service';
import { InputTextareaModule } from 'primeng/inputtextarea';


@Component({
  selector: 'app-character-creator',
  standalone: true,
  imports: [CommonModule, Button, StepperModule, ChipsModule, CharacterDetailsComponent, ReactiveFormsModule, MessagesModule, TagModule, InputTextareaModule],
  templateUrl: './character-creator.component.html',
  styleUrl: './character-creator.component.css'
})
export class CharacterCreatorComponent {
  private readonly _gender = 'gender';

  createCharacterForm!: FormGroup<CreateCharacterForm>;

  constructor(private formBuilder: FormBuilder, private rageClientService: RageClientService) {
    this.buildCreateCharacterForm();
    this.listenToAppearanceChanges();
  }

  private buildCreateCharacterForm() {
    this.createCharacterForm = characterCreateFormConfig(this.formBuilder);
  }

  submitCreateCharacterForm() {
    const characterCreate: ICharacterCreate = this.createCharacterForm.getRawValue() as ICharacterCreate;
    console.log(JSON.stringify(characterCreate));
    this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_CREATE_CHARACTER, characterCreate);
  }

  private listenToAppearanceChanges() {
    this.createCharacterForm.get(this._gender)?.valueChanges.subscribe((value) => this.handleGenderValueChange(value));
  }

  private handleGenderValueChange(value: CharacterGender) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CREATOR_CHANGE_PED_MODEL, value);
  }
}
