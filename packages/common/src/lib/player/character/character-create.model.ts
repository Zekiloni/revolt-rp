import { CharacterGender } from './character.enums';
import { ICharacterApperance } from './character.model';

export interface ICharacterCreate {
	firstName: string;
	lastName: string;
	birthday: Date;
	origin: string;
	gender: CharacterGender;
	appearance: ICharacterApperance;
}
