import axios from 'axios';
import { DiscordOAuth2TokenResponse, DiscordProfile } from '@revolt-rp/common';
import { oauth2Config } from '../../core/oauth2.config';
import { getAccountByDiscordId, setAuthorized } from './account.service';
import { AccountModel } from '../account-character.ref';

async function getDiscordAccessToken(authorizationCode: string): Promise<string> {
  return axios.post<DiscordOAuth2TokenResponse>(
    oauth2Config.DISCORD.TOKEN_ENDPOINT,
    new URLSearchParams({
      client_id: '1328754122987405363',
      client_secret: 'EDQg_CocwQigyuPWSFcXWv7JacvELsFR',
      grant_type: oauth2Config.DISCORD.GRANT_TYPE,
      code: authorizationCode,
      redirect_uri: oauth2Config.DISCORD.REDIRECT_URI
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
    .then((response) => response.data.access_token)
    .catch((error) => {
      console.error('Error fetching access token:', error.response?.data || error.message);
      throw new Error('Failed to fetch access token');
    });
}

async function getDiscordUserProfile(accessToken: string) {
  return axios.get<DiscordProfile>(oauth2Config.DISCORD.USER_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      throw new Error('Failed to fetch user profile');
    });
}

async function getOrCreateAccountByDiscordAuth(profile: DiscordProfile, player: PlayerMp) {
  const account = await getAccountByDiscordId(profile.id);
  console.log(account)
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
