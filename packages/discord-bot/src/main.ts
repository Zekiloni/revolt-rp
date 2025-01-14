import {Client, GatewayIntentBits, Partials, ActivityType} from 'discord.js';
import {environmentConfig} from './config/environment.config';
import {logger} from './config/logger.config';
import {commands} from './commands';
import {deployCommands} from './deploy-commands';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.GuildScheduledEvent],
});

client.on('ready', async () => {
  client.user?.setActivity('lscrp.net', {
    type: ActivityType.Custom,
    url: environmentConfig.WEBSITE_URL
  });

  await deployCommands({guildId: environmentConfig.DISCORD_GUILD_ID!});

  logger.info('Discord bot is up & running');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const {commandName} = interaction;
  if (commands[commandName as keyof typeof commands]) {
    await commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(environmentConfig.DISCORD_TOKEN).then(() => logger.info('Discord bot authenticated successfully'));
