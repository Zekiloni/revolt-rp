import { getModelForClass } from '@typegoose/typegoose';
import { Character } from './character/character.model';
import { Account } from './account/account.model';

export const AccountModel = getModelForClass(Account);

export const CharacterModel = getModelForClass(Character);
