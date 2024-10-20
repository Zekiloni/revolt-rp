import { CharacterGender } from './character.enums';
import { CharacterAppearance } from './character.model';

export interface ICharacterCreate {
	firstName: string;
	lastName: string;
	birthday: Date;
	origin: string;
	gender: CharacterGender;
	appearance: CharacterAppearance;
}
