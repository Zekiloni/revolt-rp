import axios from 'axios';
import { DiscordOAuth2TokenResponse, DiscordProfile } from '@revolt-rp/common';
import { authConfig } from '../config/auth.config';

export async function getDiscordAccessToken(authorizationCode: string): Promise<string> {
  return axios.post<DiscordOAuth2TokenResponse>(
    authConfig.DISCORD.TOKEN_ENDPOINT,
    new URLSearchParams({
      client_id: authConfig.DISCORD.CLIENT_ID,
      client_secret: authConfig.DISCORD.CLIENT_SECRET,
      grant_type: authConfig.DISCORD.GRANT_TYPE,
      code: authorizationCode,
      redirect_uri: authConfig.DISCORD.REDIRECT_URI
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


export const getDiscordAuthUrl = (): string => {
  const discordAuthUrl = new URL(authConfig.DISCORD.AUTH_ENDPOINT);

  discordAuthUrl.searchParams.append('client_id', authConfig.DISCORD.CLIENT_ID);
  discordAuthUrl.searchParams.append('redirect_uri', authConfig.DISCORD.REDIRECT_URI);
  discordAuthUrl.searchParams.append('response_type', authConfig.DISCORD.RESPONSE_TYPE);
  discordAuthUrl.searchParams.append('scope', authConfig.DISCORD.SCOPE);

  return discordAuthUrl.toString()
}

export async function getDiscordUserProfile(accessToken: string) {
  return axios.get<DiscordProfile>(authConfig.DISCORD.USER_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      throw new Error('Failed to fetch user profile');
    });
}
