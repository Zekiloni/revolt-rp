import { CommandCategory, ICommand, ICommandBase } from '@revolt-rp/common';


const commands: Map<string, ICommand<PlayerMp>> = new Map();

export const getCommand = (nameOrAlias: string) => {
  return commands.get(nameOrAlias);
};

export const registerCommand = (command: ICommand<PlayerMp>) => {
  if (!command.category)
    command.category = CommandCategory.General;

  if (command.aliases && command.aliases.length) {
    command.aliases.forEach((alias) => {
      commands.set(alias, command);
    });
  }

  return commands.set(command.name, command);
};


export const getAllCommands = (): ICommandBase[] => {
  const seen = new Set<string>();
  const uniqueCommands: ICommandBase[] = [];

  for (const command of commands.values()) {
    if (seen.has(command.name)) continue;
    seen.add(command.name);

    uniqueCommands.push({
      name: command.name,
      description: command.description,
      category: command.category,
      params: command.params,
      aliases: command.aliases
    });
  }

  return uniqueCommands;
};
