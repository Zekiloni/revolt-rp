import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { headOverlays, CharacterGender, HeadBlendData, ICharacterCreate, ProcedureKey } from '@bcrp-rage/common';
import {
  CreateCharacterForm,
  characterCreateFormConfig,
  HeadBlendDataForm,
  CharacterAppearanceForm, HeadOverlayComponentForm
} from '../../domain/model/character';
import { CharacterDetailsComponent } from './component/character-details';
import { RageClientService } from '../../domain/service/rage-client.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HeadBlendDataComponent } from './component/head-blend-data';
import { FaceFeatureComponent } from './component/face-feature';
import { HairComponent } from './component/hair';
import { BeardComponent } from './component/beard';
import { combineLatestWith, map, startWith } from 'rxjs';
import { PanelModule } from 'primeng/panel';
import { HeadOverlayComponent } from './component/head-overlay';


@Component({
  selector: 'app-character-creator',
  standalone: true,
  imports: [CommonModule, Button, StepperModule, ChipsModule, CharacterDetailsComponent, ReactiveFormsModule, MessagesModule, TagModule, InputTextareaModule, AccordionModule, HeadBlendDataComponent, FaceFeatureComponent, HairComponent, BeardComponent, PanelModule, HeadOverlayComponent],
  templateUrl: './character-creator.component.html',
  styleUrl: './character-creator.component.css'
})
export class CharacterCreatorComponent {
  protected readonly CharacterGender = CharacterGender;
  protected readonly headOverlays = headOverlays;

  private readonly _gender = 'gender';
  private readonly _appearance = 'appearance';
  public readonly _faceFeature = 'faceFeature';
  private readonly _headBlendData = 'headBlendData';
  private readonly _eyeColor = 'eyeColor';
  private readonly _beardStyle = 'beardStyle';
  private readonly _beardColor = 'beardColor';
  private readonly _beardOpacity = 'beardOpacity';
  private readonly _headOverlays = 'headOverlays';

  createCharacterForm!: FormGroup<CreateCharacterForm>;

  constructor(private formBuilder: FormBuilder, private rageClientService: RageClientService) {
    this.buildCreateCharacterForm();
    this.listenToAppearanceChanges();
  }

  get gender() {
    return this.createCharacterForm.get(this._gender)?.value;
  }

  get appearance() {
    return this.createCharacterForm.get(this._appearance) as FormGroup<CharacterAppearanceForm>;
  }

  getHeadOverlayComponentForm(name: string) {
    return this.appearance.get(this._headOverlays)?.get(name) as FormGroup<HeadOverlayComponentForm>;
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
    this.appearance.get(this._faceFeature)?.valueChanges.subscribe(value => this.handleFaceFeatureValueChanges(value));
    this.appearance.get(this._eyeColor)?.valueChanges.subscribe(value => this.handleEyeColorValueChange(value));

    this.appearance.markAsTouched();
    this.appearance.markAsDirty();

    this.appearance.get(this._beardStyle)?.valueChanges.pipe(
      combineLatestWith([
        this.appearance.get(this._beardColor)?.valueChanges.pipe(startWith(this.appearance.get(this._beardStyle)?.value)),
        this.appearance.get(this._beardOpacity)?.valueChanges.pipe(startWith(this.appearance.get(this._beardOpacity)?.value))
      ]),
      map((a) => a)
    ).subscribe((value) => this.handleBeardValueChange((<number[]>value)));

    this.headOverlays.forEach((headOverlay) => {
      this.getHeadOverlayComponentForm(headOverlay.key).valueChanges
        .subscribe((value) => this.handleHeadOverlayValueChange(headOverlay.overlayId, value));
    });
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

  private handleEyeColorValueChange(value: number) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CREATOR_CHANGE_EYE_COLOR, value);
  }


  private handleBeardValueChange(value: number[]) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CREATOR_UPDATE_BEARD, value);
  }

  private handleHeadOverlayValueChange(overlayId: number, value: Partial<{ value: number, opacity: number, color: number }>) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CREATOR_UPDATE_HEAD_OVERLAY, [overlayId, value]);
  }
}
