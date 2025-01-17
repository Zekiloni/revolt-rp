
export const oauth2Config = {
  DISCORD: {
    TOKEN_ENDPOINT: 'https://discord.com/api/oauth2/token',
    USER_ENDPOINT: 'https://discord.com/api/users/@me',
    REDIRECT_URI: 'https://localhost:3000/auth/discord/code',
    GRANT_TYPE: 'authorization_code'
  }
}
