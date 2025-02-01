import { t } from 'i18next';
import { customAlphabet } from 'nanoid';
import { BankAccountType, TransactionStatus, TransactionType } from '@revolt-rp/common';
import { notifyPlayer } from '../player/util/player-notify.util';
import { Character } from '../player/character/character.model';
import { BankAccountModel } from './bank-account.model';
import { TransactionModel } from './transaction.model';
import { giveMoney } from '../player/character/character.service';

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
  return TransactionModel.find({
    $or: [
      { bankAccount: bankAccountId },
      { targetBankAccount: bankAccountId }
    ]
  }).exec();
};

export const getBankAccountsByCharacter = (character: Character) => {
  return BankAccountModel.find({ character: character._id }).exec();
};

const getBankAccountByNumber = (targetAccountNumber: string) => {
  return BankAccountModel.findOne({ number: targetAccountNumber });
};


export const createBankTransaction = (bankAccountId: string, type: TransactionType, amount: number, description: string, targetBankAccountId?: string) => {
  return TransactionModel.create({
    bankAccount: bankAccountId,
    type,
    amount,
    status: TransactionStatus.Failed,
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

  const transaction = await createBankTransaction(bankAccountId, TransactionType.Withdraw, amount, t('withdraw_transaction'));

  if (bankAccount.balance < amount) {
    throw new Error(t('insufficient_funds'));
  }

  bankAccount.balance -= amount;
  await bankAccount.save();

  await giveMoney(player, amount);

  await createBankTransaction(bankAccount.id, TransactionType.Withdraw, amount, t('withdraw_transaction'));

  notifyPlayer(player, {
    severity: 'success',
    detail: `${t('withdraw')} ${amount}$ ${t('from')} ${bankAccount.number}`
  });

  transaction.status = TransactionStatus.Completed;
  await transaction.save();

  return bankAccount;
};


export const playerDepositMoney = async (player: PlayerMp, bankAccountId: string, amount: number) => {
  const bankAccount = await getBankAccountById(bankAccountId);

  if (!bankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  const transaction = await createBankTransaction(bankAccountId, TransactionType.Withdraw, amount, t('withdraw_transaction'));

  if (player.character.cash < amount) {
    throw new Error(t('not_enough_money'));
  }

  bankAccount.balance += amount;
  await bankAccount.save();

  await giveMoney(player, -amount);

  await createBankTransaction(bankAccount.id, TransactionType.Deposit, amount, t('deposit_transaction'));

  notifyPlayer(player, { severity: 'success', detail: `${t('deposit')} ${amount}$ ${t('to')} ${bankAccount.number}` });

  transaction.status = TransactionStatus.Completed;
  await transaction.save();

  return bankAccount;
};

export const playerTransferMoney = async (player: PlayerMp, bankAccountId: string, targetAccountNumber: string, amount: number) => {
  const bankAccount = await getBankAccountById(bankAccountId);
  const targetBankAccount = await getBankAccountByNumber(targetAccountNumber);

  if (!bankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  if (bankAccount.number === targetAccountNumber) {
    throw new Error(t('cant_transfer_to_same_account'));
  }

  const transaction = await createBankTransaction(bankAccountId, TransactionType.Withdraw, amount, t('transfer_transaction'), targetBankAccount.id);

  if (!targetBankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  if (bankAccount.balance < amount) {
    throw new Error(t('insufficient_funds'));
  }

  bankAccount.balance -= amount;
  await bankAccount.save();

  targetBankAccount.balance += amount;
  await targetBankAccount.save();

  notifyPlayer(player, { severity: 'success', detail: `${t('transfer')} ${amount}$ ${t('to')} ${bankAccount.number}` });

  transaction.status = TransactionStatus.Completed;
  await transaction.save();

  return bankAccount;
};


