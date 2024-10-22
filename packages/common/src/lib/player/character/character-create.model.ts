import { BloodType, CharacterGender } from './character.enums';
import { ICharacterAppearance } from './char-appeaarance.model';

export interface ICharacterCreate {
	firstName: string;
  middleName?: string;
	lastName: string;
	birthday: Date;
	origin: string;
	gender: CharacterGender;
  bloodType: BloodType;
	appearance: ICharacterAppearance;
  description?: string;
  accent?: string;
}
