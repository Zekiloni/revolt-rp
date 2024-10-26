import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { CharacterGender, HeadBlendData, ICharacterCreate, ProcedureKey } from '@bcrp-rage/common';
import {
  CreateCharacterForm,
  characterCreateFormConfig,
  HeadBlendDataForm,
  CharacterAppearanceForm
} from '../../domain/model/character';
import { CharacterDetailsComponent } from './component/character-details';
import { RageClientService } from '../../domain/service/rage-client.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HeadBlendDataComponent } from './component/head-blend-data';
import { FaceFeatureComponent } from './component/face-feature';
import { FacialHairComponent } from './component/facial-hair';


@Component({
  selector: 'app-character-creator',
  standalone: true,
  imports: [CommonModule, Button, StepperModule, ChipsModule, CharacterDetailsComponent, ReactiveFormsModule, MessagesModule, TagModule, InputTextareaModule, AccordionModule, HeadBlendDataComponent, FaceFeatureComponent, FacialHairComponent],
  templateUrl: './character-creator.component.html',
  styleUrl: './character-creator.component.css'
})
export class CharacterCreatorComponent {
  private readonly _gender = 'gender';
  private readonly _appearance = 'appearance';
  public readonly _faceFeature = 'faceFeature';
  private readonly _headBlendData = 'headBlendData';


  createCharacterForm!: FormGroup<CreateCharacterForm>;

  constructor(private formBuilder: FormBuilder, private rageClientService: RageClientService) {
    this.buildCreateCharacterForm();
    this.listenToAppearanceChanges();
  }

  get appearance() {
    return this.createCharacterForm.get(this._appearance) as FormGroup<CharacterAppearanceForm>;
  }

  get headBlendData() {
    return this.appearance?.get(this._headBlendData) as FormGroup<HeadBlendDataForm>;
  }

  private buildCreateCharacterForm() {
    this.createCharacterForm = characterCreateFormConfig(this.formBuilder);
  }

  submitCreateCharacterForm() {
    const characterCreate: ICharacterCreate = this.createCharacterForm.getRawValue() as ICharacterCreate;
    this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_CREATE_CHARACTER, characterCreate);
  }

  private listenToAppearanceChanges() {
    this.createCharacterForm.get(this._gender)?.valueChanges.subscribe((value) => this.handleGenderValueChange(value));
    this.headBlendData.valueChanges.subscribe((value) => this.handleHeadBlendDataValueChange((<HeadBlendData>value)));
    this.appearance.get(this._faceFeature)?.valueChanges.subscribe(value => this.handleFaceFeatureValueChanges(value))
  }

  private handleGenderValueChange(value: CharacterGender) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CREATOR_CHANGE_PED_MODEL, value);
    this.handleHeadBlendDataValueChange(this.headBlendData.getRawValue());
  }

  private handleHeadBlendDataValueChange(value: HeadBlendData) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CREATOR_UPDATE_HEAD_BLEND_DATA, value);
  }

  private handleFaceFeatureValueChanges(value: number[]) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CREATOR_UPDATE_FACE_FEATURE, value);
  }
}
