import { t } from 'i18next';
import { customAlphabet } from 'nanoid';
import { BankAccountType, IBankCardInfo, TransactionStatus, TransactionType } from '@revolt-rp/common';
import { notifyPlayer } from '../player/util/player-notify.util';
import { Character } from '../player/character/character.model';
import { BankAccount, BankAccountModel } from './bank-account.model';
import { TransactionModel } from './transaction.model';
import { giveMoney } from '../player/character/character.service';
import { playerGiveItem } from '../player/inventory/player-inventory.service';
import { bankingConfig } from './banking.config';
import dayjs from 'dayjs';

export const generateBankAccountNumber = () => {
  const generate = customAlphabet('0123456789', 16);
  return generate().replace(/(\d{4})(?=\d)/g, '$1-');
};


export const generatePinCode = () => {
  const generate = customAlphabet('0123456789', 4);
  return generate().replace(/(\d{4})(?=\d)/g, '$1-');
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


export const createBankCardItem = async (player: PlayerMp, bankAccount: BankAccount) => {
  const bankCardInfo: IBankCardInfo = {
    bankAccountNo: bankAccount.number,
    active: true,
    pinCode: generatePinCode()
  }

  const item = await playerGiveItem(player, 'items.credit_card', 1);
  item.bankCardInfo = bankCardInfo;
  item.expiringAt = dayjs().add(bankingConfig.DEFAULT_CREDIT_CARD_DAYS, 'days').toDate();

  await item.save();
}

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

export const getBankAccountByNumber = (bankAccountNumber: string) => {
  return BankAccountModel.findOne({ number: bankAccountNumber });
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

  const transaction = await createBankTransaction(bankAccountId, TransactionType.Deposit, amount, t('withdraw_transaction'));

  if (player.character.cash < amount) {
    throw new Error(t('not_enough_money'));
  }

  bankAccount.balance += amount;
  await bankAccount.save();

  await giveMoney(player, -amount);

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

  const transaction = await createBankTransaction(bankAccountId, TransactionType.Transfer, amount, t('transfer_transaction'), targetBankAccount.id);

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


