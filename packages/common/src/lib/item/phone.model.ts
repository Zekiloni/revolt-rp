import { Base } from '@typegoose/typegoose/lib/defaultClasses';


export enum PhoneCallStatus {
  Dialing = 'dialing',
  Ongoing = 'ongoing_call',
  Rejected = 'rejected_call',
  Missed = 'missed_call',
  Ended = 'ended_call',
}

export interface IPhoneCall {
  caller: string;
  receiver: string;
  createdAt: Date;
  status: PhoneCallStatus;
}

export enum PhoneMessageType {
  Text = 'text',
  Location = 'location',
  Image = 'image',
}

export interface IPhoneNote {
  title: string;
  content: string;
}

export interface IPhoneContact {
  name: string;
  favorite: boolean;
  phoneNumber: string;
  emailAddress?: string;
}


export interface IPhoneConversation {
  phoneNumber: string;
  lastMessage: IPhoneMessage;
  unreadMessages: number;
}

export interface IPhoneMessageCreate {
  sender: string;
  receiver: string;
  content: string;
  type: PhoneMessageType;
}

export interface IPhoneMessage extends Base {
  type: PhoneMessageType;
  sender: string;
  receiver: string;
  content: string;
  seen: boolean;
  createdAt: Date;
}

export interface IPhoneInfo {
  power: boolean;
  phoneNumber: string;
  opacity: number;
  backgroundImage: string;
  notes: IPhoneNote[];
  contacts: IPhoneContact[];
}
