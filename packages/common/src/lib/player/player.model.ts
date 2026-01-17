import { AdminType } from './account/account.model';


export interface IPlayer {
  name: string;
  id: number;
}


export interface IOnlinePlayer {
  id: number;
  name: string;
  username: string;
  administrator: AdminType;
  sessionStartAt: Date;
  ping: number;
}
