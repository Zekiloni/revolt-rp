import { CharacterGender } from './character.enums';
import { CharacterAppearance } from './character.model';

export interface CharacterCreate {
	firstName: string;
	lastName: string;
	birthday: Date;
	origin: string;
	gender: CharacterGender;
	appearance: CharacterAppearance;
}
