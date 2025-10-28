import { DiscordProfile } from '@revolt-rp/common';
import { getAccountByDiscordId, setAuthorized } from './account.service';
import { AccountModel, getDiscordAccessToken, getDiscordUserProfile } from '@revolt-rp/core';


async function getOrCreateAccountByDiscordAuth(profile: DiscordProfile, player: PlayerMp) {
  const account = await getAccountByDiscordId(profile.id);

  if (!account) {
    return AccountModel.create({
      discordId: profile.id,
      username: profile.username,
      lastIpAddress: player.ip,
      socialClubId: player.rgscId,
      socialClubUsername: player.socialClub
    });
  }

  return account;
}

export async function discordOAuth2(authorizationCode: string, player: PlayerMp) {
  return getDiscordAccessToken(authorizationCode)
    .then((accessToken) => getDiscordUserProfile(accessToken))
    .then((profile) => getOrCreateAccountByDiscordAuth(profile, player))
    .then((account) => {
      setAuthorized(player, account);
      return account;
    });
}
