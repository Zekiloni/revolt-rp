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
  updatedAt?: Date;
}

export interface IWarrantCreate {
  reason: string;
  isActive: boolean;
  targetCharacterId: string;
}

export enum SobrietyTestType {
  Alcohol = 'alcohol',
  Drug = 'drug',
}

export interface ISobrietyTest extends Base {
  target: Ref<ICharacter>;
  testedBy: Ref<ICharacter>;
  type: SobrietyTestType;
  result: boolean;
  level?: number; // BAC for alcohol, or toxicity level for drugs
  substances?: string[]; // optional, useful for drugs
  location: string;
  note?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ISobrietyTestCreate {
  targetCharacterId: string;
  type: SobrietyTestType;
  result: boolean;
  location: string;
}

export interface IGangRecord extends Base {
  name: string;
  description: string;
  location: string;
  officer: Ref<ICharacter>;
  createdAt: Date;
  updatedAt?: Date;
  note?: string;
}

export interface IGangRecordCreate {
  name: string;
  description: string;
  location: string;
  note?: string;
}

