import { customAlphabet } from 'nanoid';
import { BankAccountType } from '@revolt-rp/common';
import { Character } from '../player/character/character.model';
import { BankAccountModel } from './bank-account.model';
import { notifyPlayer } from '../player/util/player-notify.util';
import { t } from 'i18next';

export const generateBankAccountNumber = () => {
  const nanoid = customAlphabet('0123456789', 16);
  return nanoid().replace(/(\d{4})(?=\d)/g, '$1-');
};


export const getBankAccountById = (bankAccountId: string) => {
  return BankAccountModel.findById(bankAccountId);
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

export const playerWithdrawMoney = async (player: PlayerMp, bankAccountId: string, amount: number) => {
  const bankAccount = await getBankAccountById(bankAccountId);

  if (!bankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  if (bankAccount.balance < amount) {
    throw new Error(t('insufficient_funds'));
  }

  bankAccount.balance -= amount;
  await bankAccount.save();

  notifyPlayer(player, {
    severity: 'success',
    detail: `${t('withdraw')} ${amount}$ ${t('from')} ${bankAccount.number}`
  });
  return bankAccount;
};


export const playerDepositMoney = async (player: PlayerMp, bankAccountId: string, amount: number) => {
  const bankAccount = await getBankAccountById(bankAccountId);

  if (!bankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  if (player.character.cash < amount) {
    throw new Error(t('not_enough_money'));
  }

  bankAccount.balance += amount;
  await bankAccount.save();

  notifyPlayer(player, { severity: 'success', detail: `${t('deposit')} ${amount}$ ${t('to')} ${bankAccount.number}` });
  return bankAccount;
};
