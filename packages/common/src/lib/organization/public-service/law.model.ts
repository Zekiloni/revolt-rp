import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref } from '@typegoose/typegoose';
import { ICharacter } from '../../player/character/character.model';

export enum RecordType {
  Arrest = 'arrest',
  Ticket = 'ticket',
  Fare = 'fare',
}

export interface ICharge {
  code: string;
  description: string;
  fine: number;
  jailTime: number;
}

export interface ICriminalRecord extends Base {
  type: RecordType;
  target?: Ref<ICharacter>;
  numberplate?: string;
  officer: Ref<ICharacter>;
  location: string;
  charges: ICharge[];
  note?: string;
  evidences?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface IWarrant extends Base {
  target: Ref<ICharacter>;
  issuedBy: Ref<ICharacter>;
  reason: string;
  charges?: string[];
  expiringAt?: Date;
  isActive: boolean;
  createdAt: Date;
}
