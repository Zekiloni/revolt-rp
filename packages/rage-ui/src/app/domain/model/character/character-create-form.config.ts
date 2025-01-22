import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BloodType, CharacterGender } from '@revolt-rp/common';
import { characterAgeValidator } from '../../util/character-age.validator';
import { capitalLetterValidator } from '../../util/capital-letter.validator';


const NAME_VALIDATORS = [
  Validators.required,
  Validators.minLength(2),
  Validators.maxLength(25),
  capitalLetterValidator
];

export const characterCreateFormConfig = (formBuilder: FormBuilder): FormGroup =>
  formBuilder.group({
    firstName: new FormControl<string>('', NAME_VALIDATORS),
    middleName: new FormControl<string>('', [Validators.minLength(2)]),
    lastName: new FormControl<string>('', NAME_VALIDATORS),
    gender: new FormControl<CharacterGender>(CharacterGender.MALE, [Validators.required]),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    birthday: new FormControl<Date | null>(null!, [Validators.required, characterAgeValidator]),
    origin: new FormControl<string>('', [Validators.required]),
    bloodType: new FormControl<BloodType>(BloodType.O_POSITIVE, [Validators.required]),
    accent: new FormControl<string>(''),
    description: new FormControl<string>(''),
    appearance: formBuilder.group({
      eyeColor: new FormControl<number>(0),
      hairStyle: new FormControl<number>(0),
      hairColor: new FormControl<number>(0),
      hairHighlightColor: new FormControl<number>(0),
      beardStyle: new FormControl<number>(255),
      beardColor: new FormControl<number>(0),
      beardOpacity: new FormControl<number>(1.0),
      faceFeature: new FormArray<FormControl<number | null>>(
        Array.from({ length: 20 }, () => new FormControl<number>(0.0))
      ),
      headBlendData: formBuilder.group({
        shapeFirstId: new FormControl<number>(0),
        shapeSecondId: new FormControl<number>(0),
        shapeThirdId: new FormControl<number>(0),
        skinFirstId: new FormControl<number>(0),
        skinSecondId: new FormControl<number>(0),
        skinThirdId: new FormControl<number>(0),
        shapeMix: new FormControl<number>(0),
        skinMix: new FormControl<number>(0),
        thirdMix: new FormControl<number>(0),
        isParent: new FormControl<boolean>(true)
      }),
      headOverlays: formBuilder.group({
        blemishes: formBuilder.group({
          value: new FormControl<number>(255),
          color: new FormControl<number>(0),
          opacity: new FormControl<number>(1.0)
        }),
        eyebrows: formBuilder.group({
          value: new FormControl<number>(255),
          color: new FormControl<number>(0),
          opacity: new FormControl<number>(1.0)
        }),
        ageing: formBuilder.group({
          value: new FormControl<number>(255),
          color: new FormControl<number>(0),
          opacity: new FormControl<number>(1.0)
        }),
        makeup: formBuilder.group({
          value: new FormControl<number>(255),
          color: new FormControl<number>(0),
          opacity: new FormControl<number>(1.0)
        }),
        blush: formBuilder.group({
          value: new FormControl<number>(255),
          color: new FormControl<number>(0),
          opacity: new FormControl<number>(1.0)
        }),
        complexion: formBuilder.group({
          value: new FormControl<number>(255),
          color: new FormControl<number>(0),
          opacity: new FormControl<number>(1.0)
        }),
        sunDamage: formBuilder.group({
          value: new FormControl<number>(255),
          color: new FormControl<number>(0),
          opacity: new FormControl<number>(1.0)
        }),
        lipstick: formBuilder.group({
          value: new FormControl<number>(255),
          color: new FormControl<number>(0),
          opacity: new FormControl<number>(1.0)
        }),
        molesFreckles: formBuilder.group({
          value: new FormControl<number>(255),
          color: new FormControl<number>(0),
          opacity: new FormControl<number>(1.0)
        }),
        chestHair: formBuilder.group({
          value: new FormControl<number>(255),
          color: new FormControl<number>(0),
          opacity: new FormControl<number>(1.0)
        })
      })
    })
  });
