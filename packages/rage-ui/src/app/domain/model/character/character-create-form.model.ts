import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CharacterGender } from '@bcrp-rage/common';

interface CharacterAppearanceForm {
  eyeColor: FormControl<number>;
  hairStyle: FormControl<number>;
  hairColor: FormControl<number>;
  hairHighlightColor: FormControl<number>;
  faceFeature: FormArray<FormControl<number>>
  headBlendData: FormGroup<{
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
  }>;
}

export interface CreateCharacterForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  gender: FormControl<CharacterGender>;
  birthday: FormControl<Date | null>;
  origin: FormControl<string>;
  appearance: FormGroup<CharacterAppearanceForm>;
}
