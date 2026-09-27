import { ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { t } from 'i18next';
import { IAccountCreate, AdminType, PlayerSharedDataType } from '@revolt-rp/common';
import { FilterQuery } from 'mongoose';
import { Account, AccountModel } from '@revolt-rp/core';


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

export const getAccountByQuery = async (query: FilterQuery<Account>) => {
  return AccountModel.findOne(query).exec();
}

export const getAccountByUsernameOrEmail = async (username: string, email: string) => {
  return AccountModel.findOne({
    $or: [
      { email }, { username }
    ]
  }).exec();
};

export const createAccount = async (accountCreate: IAccountCreate, { player }: ProcedureListenerInfo<PlayerMp>) => {
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

  if (!account.socialClubId) {
    account.socialClubId = player.rgscId;
  }

  if (!account.socialClubUsername) {
    account.socialClubUsername = player.socialClub;
  }

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


export const setMutedUntil = async (player: PlayerMp, mutedUntil: Date | null) => {
  player.setVariable(PlayerSharedDataType.MutedUntil, mutedUntil ? mutedUntil.toISOString() : null);
  player.account.mutedUntil = mutedUntil || undefined;
  await player.account.save();
}
