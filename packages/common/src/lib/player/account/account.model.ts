import { Ref } from '@typegoose/typegoose';
import { ICharacter } from '../character/character.model';

export enum AdminType {
	TRIAL_ADMIN = 1,
	JUNIOR_ADMIN = 2,
	ADMINISTRATOR = 3,
	SENIOR_ADMIN = 4,
	LEAD_ADMIN = 5,
	SUPER_ADMIN = 6,
}

export interface IAccount {
	id?: string;
	username: string;
	emailAddress: string;
	password: string;
	isEmailVerified: boolean;
	lastIpAddress?: string;
	socialClubUsername?: string;
	administrator?: AdminType;
	maxCharacters: number;
	socialClubId?: string;
	updatedAt?: Date;
	createdAt: Date;
	characters: Ref<(ICharacter)>[];
}
