import { customAlphabet } from 'nanoid';
import { BankAccountType } from '@revolt-rp/common';
import { Character } from '../player/character/character.model';
import { BankAccountModel } from './bank-account.model';

export const generateBankAccountNumber = () => {
  const nanoid = customAlphabet('0123456789', 16);
  return nanoid().replace(/(\d{4})(?=\d)/g, '$1-');
};

export const createBankAccount = (character: Character, type: BankAccountType, balance = 0) => {
  return BankAccountModel.create({
    character,
    balance,
    number: generateBankAccountNumber(),
    type
  });
};

export const getBankAccountsByCharacter = (character: Character) => {
  return BankAccountModel.find({ character: character._id });
};


export const getSavingAccountByCharacter = (character: Character) => {
  return BankAccountModel.findOne({ character: character._id, type: BankAccountType.Savings });
};

