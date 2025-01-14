import axios from 'axios';
import { oauth2Config } from '../../core/oauth2.config';

async function getDiscordAccessToken(authorizationCode: string): Promise<string> {
  return axios.post(
    oauth2Config.DISCORD.TOKEN_ENDPOINT,
    new URLSearchParams({
      client_id: 'CLIENT_ID',
      client_secret: 'CLIENT_SECRET',
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: 'REDIRECT_URI',
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
    .then((response) => response.data.access_token)
    .catch((error) => {
      console.error('Error fetching access token:', error.response?.data || error.message);
      throw new Error('Failed to fetch access token');
    });
}

async function getDiscordUserProfile(accessToken: string) {
  return axios.get(oauth2Config.DISCORD.USER_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      throw new Error('Failed to fetch user profile');
    });
}


export async function discordOAuth2(authorizationCode: string) {
  return getDiscordAccessToken(authorizationCode)
    .then((accessToken) => getDiscordUserProfile(accessToken));
}
