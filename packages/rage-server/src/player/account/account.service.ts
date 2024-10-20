import { ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { getModelForClass, Ref } from '@typegoose/typegoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { t } from 'i18next';
import { IAccount, AccountCreate, AdminType, ICharacter } from '@bcrp-rage/common';
import { getCharactersByAccountId } from '../character/character.service';


export class Account implements IAccount{
  administrator: AdminType;
  characters: Ref<ICharacter>[];
  createdAt: Date;
  emailAddress: string;
  id: string;
  isEmailVerified: boolean;
  lastIpAddress: string;
  maxCharacters: number;
  password: string;
  socialClubId: string;
  socialClubUsername: string;
  updatedAt: Date;
  username: string;

}

export const AccountModel = getModelForClass(Account);

export const getAccountByUsername = async (username: string) => {
	return AccountModel.findOne({ username }).exec();
};

export const getAccountByUsernameOrEmail = async (username: string, email: string) => {
	return AccountModel.findOne({
		$or: [
			{ email }, { username }
		]
	}).exec();
};

export const createAccount = async (accountCreate: AccountCreate, { player }: ProcedureListenerInfo<PlayerMp>) => {
	const alreadyExist = await getAccountByUsernameOrEmail(accountCreate.username, accountCreate.emailAddress);

	if (alreadyExist) {
		throw new Error(t('account_already_exist', { username: accountCreate.username, email: accountCreate.emailAddress }));
	}

	return AccountModel.create({
		...accountCreate,
		password: hashSync(accountCreate.password, genSaltSync(12)),
		lastIpAddress: player.ip,
		socialClubId: player.socialClub,
		socialClubUsername: player.rgscId
	});
};

export const authorizeAccount = async (username: string, password: string) => {
	const account = await getAccountByUsername(username);

	if (!account)
		throw new Error(t('account_doesnt_exist', { username }));

	const characters = await getCharactersByAccountId(account.id);

	return [account, characters];
};


