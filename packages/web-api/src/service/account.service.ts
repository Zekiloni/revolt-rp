import { AccountModel, getDiscordAccessToken, getDiscordUserProfile } from '@revolt-rp/core';


export const getOrCreateByDiscord = async (authorizationCode: string, ipAddress: string) => {
  const token = await getDiscordAccessToken(authorizationCode);
  const discordUser = await getDiscordUserProfile(token);

  const exist = await AccountModel.findOne({ discordId: discordUser.id }).populate({
    path: 'characters',
    select: '-account'
  }).exec();

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
