import { prop, Ref } from '@typegoose/typegoose';
import { Character } from '../character/character.model';
import { accountConfig } from './account.config';

export enum AdminType {
	NONE = 0,
	TRIAL_ADMIN = 1,
	JUNIOR_ADMIN = 2,
	ADMINISTRATOR = 3,
	SENIOR_ADMIN = 4,
	LEAD_ADMIN = 5,
	SUPER_ADMIN = 6,
}

export class Account {
	id!: string;
	@prop({ required: true, unique: true })
	username!: string;

	@prop({ required: true, unique: true })
	emailAddress!: string;

	@prop({ required: true })
	password!: string;

	@prop({ default: false })
	isEmailVerified: boolean = false;

	@prop()
	lastIpAddress!: string;

	@prop({ required: true })
	socialClubUsername!: string;

	@prop({ enum: Object.values(AdminType) })
	administrator!: AdminType;

	@prop({ default: accountConfig.DEFAULT_MAX_CHARACTERS })
	maxCharacters!: number;

	@prop()
	socialClubId!: string;

	@prop()
	updatedAt!: Date;

	@prop({ default: () => Date.now() })
	createdAt!: Date;

	@prop({ ref: () => Character, type: () => String })
	characters!: Ref<(Character)>[];
}