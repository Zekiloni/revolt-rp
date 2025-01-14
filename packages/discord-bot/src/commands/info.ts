import {
   ColorResolvable,
   CommandInteraction,
   EmbedBuilder,
   SlashCommandBuilder
} from 'discord.js';
import {environmentConfig} from '../config/environment.config';

export const data = new SlashCommandBuilder()
   .setName('info')
   .setDescription('Pruža osnovne informacije');

function createInfoEmbed() {
   const fields = [
      {name: 'Website', value: environmentConfig.WEBSITE_URL!},
      {name: 'SA-MP Server IP', value: environmentConfig.SAMP_SERVER_ADDRESS!},
      {name: 'RAGE.MP Server IP', value: 'Coming Soon'}
   ];

   return new EmbedBuilder().setColor(0x0099FF)
      .setTitle('Informacije')
      .setColor(environmentConfig.PRIMARY_COLOR as ColorResolvable)
      .addFields(...fields);
}

export async function execute(interaction: CommandInteraction) {
   
   return interaction.reply({
      fetchReply: true,
      embeds: [createInfoEmbed()], components: []
   });
}
