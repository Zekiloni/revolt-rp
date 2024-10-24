import { AdminType } from '@bcrp-rage/common';

interface CommandValidator {
  validate: (player: PlayerMp) => boolean;
  message: string;
}

export interface ICommand {
  name: string;
  description: string;
  aliases?: string[];
  administrator?: AdminType;
  params?: string[];
  validators?: CommandValidator[];

  handle(player: PlayerMp, ...args: never[]): void;
}

const commands: Map<string, ICommand> = new Map();

export const getCommand = (nameOrAlias: string) => {
  return commands.get(nameOrAlias);
};

export const registerCommand = (command: ICommand) => {
  if (command.aliases && command.aliases.length) {
    command.aliases.forEach((alias) => {
      commands.set(alias, command);
    });
  }

  return commands.set(command.name, command);
};
