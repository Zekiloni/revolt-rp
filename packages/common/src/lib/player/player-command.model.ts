import { AdminType } from './account/account.model';


export enum CommandCategory {
  General = 'general',
  Organization = 'organization',
  Admin = 'admin',
  Vehicle = 'vehicle',
  Property = 'property',
}

export interface ICommandValidator<T> {
  validate: (player: T) => boolean;
  message: string;
}

export interface ICommandBase {
  name: string;
  description: string;
  category?: CommandCategory;
  params?: string[];
  aliases?: string[];
}


export interface ICommand<T> extends ICommandBase {
  administrator?: AdminType;
  validators?: ICommandValidator<T>[];

  handle(player: T, ...args: string[]): void;
}


