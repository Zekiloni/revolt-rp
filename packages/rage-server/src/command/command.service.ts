// import { AdminType } from "@bcrp-rage/common";
//
// interface SlashCommandValidator {
//   validator: (player: PlayerMp) => boolean;
//   message: string;
// }
//
// interface SlashCommandParam {
//   name: string;
//   type: 'string' | 'number' | 'boolean';
//   joinRest?: true;
// }
//
// export interface SlashCommand {
//   name: string;
//   description: string;
//   aliases?: string[];
//   administrator?: AdminType;
//   params?: SlashCommandParam[];
//   validators?: SlashCommandValidator[];
//
//   execute(player: PlayerMp, ...args: any[]): void;
// }
//
// export const slashCommands: Map<string, SlashCommand> = new Map();
//
// export const registerSlashCommand = (command: SlashCommand) => {
//   if (command.aliases && command.aliases.length > 0) {
//     command.aliases.forEach((alias) => {
//       slashCommands.set(alias, command);
//     });
//   }
//
//   return slashCommands.set(command.name, command);
// };
//
// export const getSlashCommand = (nameOrAlias: string) => {
//   return slashCommands.get(nameOrAlias);
// };
