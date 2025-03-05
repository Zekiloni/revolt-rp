

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

export interface IPhoneMessage {
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
