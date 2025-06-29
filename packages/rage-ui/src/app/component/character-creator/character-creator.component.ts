import { combineLatestWith, map, startWith } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { ChipsModule } from 'primeng/chips';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { CharacterGender, HeadBlendData, headOverlays, ICharacterCreate, ProcedureKey } from '@revolt-rp/common';
import {
  CharacterAppearanceForm,
  characterCreateFormConfig,
  CreateCharacterForm,
  HeadBlendDataForm,
  HeadOverlayComponentForm
} from '../../domain/model/character';
import { CharacterDetailsComponent } from './component/character-details';
import { RageClientService } from '../../domain/service/rage-client.service';
import { HeadBlendDataComponent } from './component/head-blend-data';
import { FaceFeatureComponent } from './component/face-feature';
import { HairComponent } from './component/hair';
import { BeardComponent } from './component/beard';
import { HeadOverlayComponent } from './component/head-overlay';
import { OutfitSelectorComponent } from './component/outfit-selector';
import { Textarea } from 'primeng/textarea';
import { Message } from 'primeng/message';


@Component({
  selector: 'app-character-creator',
  standalone: true,
  imports: [CommonModule, Button, StepperModule, ChipsModule, CharacterDetailsComponent, ReactiveFormsModule, MessagesModule, TagModule, AccordionModule, HeadBlendDataComponent, FaceFeatureComponent, HairComponent, BeardComponent, PanelModule, HeadOverlayComponent, TranslatePipe, OutfitSelectorComponent, Textarea, Message],
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
  private readonly _hairStyle = 'hairStyle';
  private readonly _hairColor = 'hairColor';
  private readonly _hairHighlightColor = 'hairHighlightColor';
  private _outfit = 'outfit';

  createCharacterForm!: FormGroup<CreateCharacterForm>;

  constructor(private formBuilder: FormBuilder, private rageClientService: RageClientService) {
    this.buildCreateCharacterForm();
    this.listenToAppearanceChanges();
    this.listenToOutfitChanges();
    this.handleOutfitChange(this.createCharacterForm.get(this._outfit)?.value);
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

    this.appearance.get(this._hairStyle)?.valueChanges.pipe(
      combineLatestWith([
        this.appearance.get(this._hairColor)?.valueChanges.pipe(startWith(this.appearance.get(this._hairColor)?.value)),
        this.appearance.get(this._hairHighlightColor)?.valueChanges.pipe(startWith(this.appearance.get(this._hairHighlightColor)?.value))
      ]),
      map((a) => a)
    ).subscribe((value) => this.handleHairValueChange((<number[]>value)));


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
    this.handleOutfitChange(this.createCharacterForm.get(this._outfit)?.value);
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

  private handleHeadOverlayValueChange(overlayId: number, value: Partial<{
    value: number,
    opacity: number,
    color: number
  }>) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CREATOR_UPDATE_HEAD_OVERLAY, [overlayId, value]);
  }

  private handleHairValueChange(value1: number[]) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CREATOR_UPDATE_HAIR, value1);
  }

  private listenToOutfitChanges() {
    this.createCharacterForm.get(this._outfit)?.valueChanges.subscribe(value => this.handleOutfitChange(value));
  }

  private handleOutfitChange(value: number) {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_CREATOR_CHANGE_OUTFIT, [this.gender, value]);
  }
}
