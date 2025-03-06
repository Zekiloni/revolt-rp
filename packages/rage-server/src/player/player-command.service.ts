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


export const getBaseCommands = (): ICommandBase[] => {
  return Object.values(commands).map((command) => {
    return {
      name: command.name,
      description: command.description,
      category: command.category,
      params: command.params,
      aliases: command.aliases
    }
  })
}
