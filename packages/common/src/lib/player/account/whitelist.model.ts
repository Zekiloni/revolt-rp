import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref } from '@typegoose/typegoose';
import { IAccount } from './account.model';

export enum WhitelistStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IWhitelistAnswer {
  question: string;
  answer: string;
}

export interface IWhitelist extends Base {
  account: Ref<IAccount>;
  status: WhitelistStatus;
  answers: IWhitelistAnswer[];
  essayAnswers: IWhitelistAnswer[];
  note?: string;
  reviewedBy?: Ref<IAccount> | IAccount;
  createdAt: Date;
  updatedAt?: Date;
  grade: number;
}

export interface IWhiteListCreate {
  answers: IWhitelistAnswer[];
  essayAnswers: IWhitelistAnswer[];
}

export interface IWhitelistQuestion {
  question: string;
  answers: { content: string, isCorrect?: true }[];
}

export interface IWhitelistTest {
  maxEssayQuestions: number;
  maxQuestions: number;
  questions: IWhitelistQuestion[];
  essayQuestions: string[];
}
