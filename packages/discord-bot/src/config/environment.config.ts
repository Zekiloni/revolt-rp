import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({
  path: resolve(__dirname, '.env')
});

const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  WEBSITE_URL,
  DISCORD_GUILD_ID,
  PRIMARY_COLOR,
  RAGE_SERVER_ADDRESS
} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error('Missing environment variables');
}

export const environmentConfig = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID,
  PRIMARY_COLOR,
  WEBSITE_URL,
  RAGE_SERVER_ADDRESS
};
