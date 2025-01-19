import { ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { t } from 'i18next';
import { AccountCreate, AdminType, PlayerSharedDataType } from '@revolt-rp/common';
import { AccountModel } from '../account-character.ref';
import { Account } from './account.model';


export const getAccountByUsername = async (username: string) => {
  return AccountModel.findOne({ username }).populate({
    path: 'characters',
    select: '-account'
  }).exec();
};


export const getAccountByDiscordId = async (discordId: string) => {
  return AccountModel.findOne({ discordId }).populate({
    path: 'characters',
    select: '-account'
  }).exec();
}

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
    throw new Error(t('account_already_exist', {
      username: accountCreate.username,
      email: accountCreate.emailAddress
    }));
  }

  return AccountModel.create({
    ...accountCreate,
    password: hashSync(accountCreate.password, genSaltSync(12)),
    lastIpAddress: player.ip,
    socialClubId: player.rgscId,
    socialClubUsername: player.socialClub
  });
};

export function setAuthorized(player: PlayerMp, account: Account) {
  account.lastIpAddress = player.ip;
  account.lastLoginAt = new Date();
  player.account = account;
}

export const authorizeAccount = async (player: PlayerMp, username: string, password: string) => {
  const account = await getAccountByUsername(username);

  if (!account)
    throw new Error(t('account_doesnt_exist', { username }));

  if (!compareSync(password, account.password))
    throw new Error(t('incorrect_password'));

  setAuthorized(player, account);

  return account;
};


export const setAdministrator = async (player: PlayerMp, adminLevel: AdminType) => {
  player.setVariable(PlayerSharedDataType.Administrator, adminLevel);
  player.account.administrator = adminLevel;
  await player.account.save();
}

