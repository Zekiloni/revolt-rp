import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BloodType, CharacterGender } from '@revolt-rp/common';

export interface HeadBlendDataForm {
  shapeFirstId: FormControl<number>;
  shapeSecondId: FormControl<number>;
  shapeThirdId: FormControl<number>;
  skinFirstId: FormControl<number>;
  skinSecondId: FormControl<number>;
  skinThirdId: FormControl<number>;
  shapeMix: FormControl<number>;
  skinMix: FormControl<number>;
  thirdMix: FormControl<number>;
  isParent: FormControl<boolean>;
}

export interface HeadOverlayComponentForm {
  value: FormControl<number>
  color: FormControl<number>
  opacity: FormControl<number>;
}

interface HeadOverlaysForm {
  blemishes: FormGroup<HeadOverlayComponentForm>;
  eyebrows: FormGroup<HeadOverlayComponentForm>;
  ageing: FormGroup<HeadOverlayComponentForm>;
  makeup: FormGroup<HeadOverlayComponentForm>;
  blush: FormGroup<HeadOverlayComponentForm>;
  complexion: FormGroup<HeadOverlayComponentForm>;
  sunDamage: FormGroup<HeadOverlayComponentForm>;
  lipstick: FormGroup<HeadOverlayComponentForm>;
  molesFreckles: FormGroup<HeadOverlayComponentForm>;
  chestHair: FormGroup<HeadOverlayComponentForm>;
}

export interface CharacterAppearanceForm {
  eyeColor: FormControl<number>;
  hairStyle: FormControl<number>;
  hairColor: FormControl<number>;
  hairHighlightColor: FormControl<number>;
  beardStyle: FormControl<number>;
  beardColor: FormControl<number>;
  beardOpacity: FormControl<number>
  faceFeature: FormArray<FormControl<number>>
  headBlendData: FormGroup<HeadBlendDataForm>;
  headOverlays: FormGroup<HeadOverlaysForm>
}

export interface CreateCharacterForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  gender: FormControl<CharacterGender>;
  birthday: FormControl<Date | null>;
  origin: FormControl<string>;
  bloodType: FormControl<BloodType>;
  appearance: FormGroup<CharacterAppearanceForm>;
}
