import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ICharacter } from '../player/character/character.model';


export enum BankAccountType {
  Main = 'main',
  Savings = 'savings'
}


export interface IBankPhoneLink {
  bankAccountId: string;
  phoneNumber: string | null;
}

export interface IBankAccount extends Base {
  character: Ref<ICharacter>;
  number: string;
  balance: number;
  type: BankAccountType;
  phoneNumber: string | null;
  createdAt: Date;
}
