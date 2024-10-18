import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CharacterGender } from '@bcrp-rage/common';

const NAME_VALIDATORS = [Validators.required, Validators.minLength(2), Validators.maxLength(25)];

export const characterCreateFormConfig = (formBuilder: FormBuilder): FormGroup =>
  formBuilder.group({
    firstName: new FormControl<string>('', NAME_VALIDATORS),
    lastName: new FormControl<string>('', NAME_VALIDATORS),
    gender: new FormControl<CharacterGender>(CharacterGender.MALE, [Validators.required]),
    birthday: new FormControl<Date | null>(null!, [Validators.required]),
    origin: new FormControl<string>('', [Validators.required]),
    appearance: formBuilder.group({
      eyeColor: new FormControl<number>(0, [Validators.required]),
      hairStyle: new FormControl<number>(0, [Validators.required]),
      hairColor: new FormControl<number>(0, [Validators.required]),
      hairHighlightColor: new FormControl<number>(0, [Validators.required]),
      faceFeature: new FormArray<FormControl<number>>([]),
      headBlendData: formBuilder.group({
        shapeFirstId: new FormControl<number>(0, [Validators.required]),
        shapeSecondId: new FormControl<number>(0, [Validators.required]),
        shapeThirdId: new FormControl<number>(0, [Validators.required]),
        skinFirstId: new FormControl<number>(0, [Validators.required]),
        skinSecondId: new FormControl<number>(0, [Validators.required]),
        skinThirdId: new FormControl<number>(0, [Validators.required]),
        shapeMix: new FormControl<number>(0, [Validators.required]),
        skinMix: new FormControl<number>(0, [Validators.required]),
        thirdMix: new FormControl<number>(0, [Validators.required]),
        isParent: new FormControl<boolean>(true, [Validators.required])
      })
    })
  });
