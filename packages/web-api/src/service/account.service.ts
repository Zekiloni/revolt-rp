import { AccountModel, getDiscordAccessToken, getDiscordUserProfile } from '@revolt-rp/core';
import { compareSync } from 'bcryptjs';


export const login = async (username: string, password: string) => {
  const account = await AccountModel.findOne({ username });
  if (!account) {
    throw new Error('account_not_found');
  }

  const isPasswordValid = compareSync(password, account.password);

  if (!isPasswordValid) {
    throw new Error('invalid_password');
  }

  return account;
}

export const getOrCreateByDiscord = async (authorizationCode: string, ipAddress: string) => {
  const token = await getDiscordAccessToken(authorizationCode);
  const discordUser = await getDiscordUserProfile(token);

  const exist = await AccountModel.findOne({ discordId: discordUser.id })

  if (exist) {
    return exist;
  }

  return AccountModel.create({
    discordId: discordUser.id,
    username: discordUser.username,
    emailAddress: discordUser.email,
    isEmailVerified: discordUser.verified,
    lastIpAddress: ipAddress
  });
};


export const getAccountById = async (accountId: string) => {
  return AccountModel.findById(accountId).populate({
    path: 'characters',
    select: '-account'
  }).exec();
}
