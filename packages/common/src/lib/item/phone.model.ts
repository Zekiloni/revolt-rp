import { Base } from '@typegoose/typegoose/lib/defaultClasses';


export enum PhoneCallStatus {
  Dialing = 'dialing',
  Ongoing = 'ongoing_call',
  Rejected = 'rejected_call',
  Ended = 'ended_call',
}

export interface IPhoneCall extends Base {
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


export interface IPhoneContactCreate {
  phoneItemId: string;
  name: string;
  phoneNumber: string;
  favorite: boolean;
  emailAddress?: string;
}

export interface IPhoneContact {
  id: string;
  name: string;
  favorite: boolean;
  phoneNumber: string;
  emailAddress?: string;
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

export interface IPhoneSettingsUpdate {
  itemId: string;
  power: boolean;
  opacity: number;
  backgroundImage: string;
}

export interface IPhoneInfo {
  power: boolean;
  phoneNumber: string;
  opacity: number;
  backgroundImage: string;
  notes: string[];
  contacts: IPhoneContact[];
}

export const ACTIVA_CALL_STATUS = [PhoneCallStatus.Dialing, PhoneCallStatus.Ongoing];
