
export const authConfig = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRES_IN: '1h',
  DISCORD: {
    CLIENT_ID: '1328754122987405363',
    CLIENT_SECRET: 'EDQg_CocwQigyuPWSFcXWv7JacvELsFR',
    TOKEN_ENDPOINT: 'https://discord.com/api/oauth2/token',
    USER_ENDPOINT: 'https://discord.com/api/users/@me',
    REDIRECT_URI: 'http://localhost:3000/api/auth/oauth2/discord/callback',
    RESPONSE_TYPE: 'code',
    GRANT_TYPE: 'authorization_code',
    AUTH_ENDPOINT: 'https://discord.com/api/oauth2/authorize',
    SCOPE: 'identify email',
  }
}
