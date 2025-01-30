import { t } from 'i18next';
import { customAlphabet } from 'nanoid';
import { BankAccountType, TransactionType } from '@revolt-rp/common';
import { notifyPlayer } from '../player/util/player-notify.util';
import { Character } from '../player/character/character.model';
import { BankAccountModel } from './bank-account.model';
import { TransactionModel } from './transaction.model';

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


export const getBankAccountTransactions = (bankAccountId: string) => {
  return TransactionModel.find({ bankAccount: bankAccountId }).exec();
};

export const getBankAccountsByCharacter = (character: Character) => {
  return BankAccountModel.find({ character: character._id }).exec();
};

export const createBankTransaction = (bankAccountId: string, type: TransactionType, amount: number, description: string, targetBankAccountId?: string) => {
  return TransactionModel.create({
    bankAccount: bankAccountId,
    type,
    amount,
    description,
    targetBankAccount: targetBankAccountId
  });
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

  await createBankTransaction(bankAccount.id, TransactionType.Withdraw, amount, t('withdraw_transaction'));

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

  await createBankTransaction(bankAccount.id, TransactionType.Deposit, amount, t('deposit_transaction'));

  notifyPlayer(player, { severity: 'success', detail: `${t('deposit')} ${amount}$ ${t('to')} ${bankAccount.number}` });
  return bankAccount;
};

