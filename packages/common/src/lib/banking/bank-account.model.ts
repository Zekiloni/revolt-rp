import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ICharacter } from '../player/character/character.model';


export enum BankAccountType {
  Main = 'main',
  Savings = 'savings'
}

export interface IBankAccount extends Base {
  character: Ref<ICharacter>;
  number: string;
  balance: number;
  type: BankAccountType;
  createdAt: Date;
}
