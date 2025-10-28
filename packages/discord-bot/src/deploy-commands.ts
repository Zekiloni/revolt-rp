import {REST, Routes, Snowflake} from 'discord.js';
import {environmentConfig} from './config/environment.config';
import {logger} from './config/logger.config';
import {commands} from './commands';

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({version: '10'}).setToken(environmentConfig.DISCORD_TOKEN);

type DeployCommandsProps = {
   guildId: string;
};

export async function deployCommands({guildId}: DeployCommandsProps) {
   try {
      logger.info('Started refreshing application (/) commands.');

      await rest.put(
         Routes.applicationGuildCommands((<Snowflake>environmentConfig.DISCORD_CLIENT_ID), (<Snowflake>guildId)),
         {
            body: commandsData,
         }
      );

      logger.info('Successfully reloaded application (/) commands.');
   } catch (error) {
      logger.error();
   }
}
