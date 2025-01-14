declare global {
   namespace NodeJS {
      interface ProcessEnv {
         [key: string]: string | undefined;
         DISCORD_TOKEN: string;
         DISCORD_CLIENT_ID: string;
         WEBSITE_URL: string;
         DISCORD_GUILD_ID: string;
         PRIMARY_COLOR: string;
         SAMP_SERVER_ADDRESS: string;
      }
   }
}