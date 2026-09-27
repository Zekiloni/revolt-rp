import { AccountModel, BanModel, getDiscordAccessToken, getDiscordUserProfile, KickModel } from '@revolt-rp/core';
import { compareSync, hashSync } from 'bcryptjs';

console.log('pw is ' + hashSync('kapakapa', 10));
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
};

export const getOrCreateByDiscord = async (authorizationCode: string, ipAddress: string) => {
  const token = await getDiscordAccessToken(authorizationCode);
  const discordUser = await getDiscordUserProfile(token);

  const exist = await AccountModel.findOne({ discordId: discordUser.id });

  if (exist) {
    return exist;
  }

  return AccountModel.create({
    discordId: discordUser.id,
    username: discordUser.username,
    emailAddress: discordUser.email,
    discordUsername: discordUser.username,
    isEmailVerified: discordUser.verified,
    lastIpAddress: ipAddress
  });
};


export const getAccountById = async (accountId: string) => {
  return AccountModel.findById(accountId)
    .select('-password')
    .populate('whitelist')
    .populate({
      path: 'characters',
      select: '-account'
    })
    .exec();
};


export const getKickLogs = async (accountId: string, limit = 50, offset = 0) => {
  return Promise.all([
    KickModel.find({ account: accountId })
      .populate('admin', 'username')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec(),
    KickModel.countDocuments({ account: accountId }).exec()
  ]);
};

export const getBanLogs = async (accountId: string, limit = 50, offset = 0) => {
  return Promise.all([
    BanModel.find({ account: accountId })
      .populate('admin', 'username')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec(),
    BanModel.countDocuments({ account: accountId }).exec()
  ]);
};


export const updatePassword = async (accountId: string, newPassword: string) => {
  return AccountModel.updateOne({ _id: accountId }, { password: newPassword }).exec();
}
