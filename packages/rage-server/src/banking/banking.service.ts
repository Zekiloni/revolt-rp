import dayjs from 'dayjs';
import { t } from 'i18next';
import { FilterQuery } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { BankAccountType, GameUiKey, TransactionStatus, TransactionType } from '@revolt-rp/common';
import { notifyPlayer } from '../player/util/player-notify.util';
import { giveMoney } from '../player/character/character.service';
import { getPlayerByItemId, getPlayerItemById, playerGiveItem } from '../player/inventory/player-inventory.service';
import { bankingConfig } from './banking.config';
import { getItemById } from '../item/item.service';
import { getPhoneByPhoneNumber } from '../player/inventory/phone/player-phone.service';
import { calculateTaxRate } from './tax.util';
import { showPlayerGameInterface } from '../player/util/player.util';
import {
  BankAccount,
  BankAccountModel,
  Character,
  Item,
  ItemModel,
  Property,
  Transaction,
  TransactionModel
} from '@revolt-rp/core';


export const generateBankAccountNumber = () => {
  const generate = customAlphabet('0123456789', 16);
  return generate().replace(/(\d{4})(?=\d)/g, '$1-');
};


export function openBankMenu(player: PlayerMp, _property: Property) {
  showPlayerGameInterface(player, GameUiKey.BankMenu);
}

export const generatePinCode = () => {
  const generate = customAlphabet('0123456789', 4);
  return generate().replace(/(\d{4})(?=\d)/g, '$1-');
};

export const getBankAccountById = (bankAccountId: string) => {
  return BankAccountModel.findById(bankAccountId);
};


export const getBankAccountByPhoneNumber = (phoneNumber: string) => {
  return BankAccountModel.findOne({ phoneNumber }).exec();
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
  return playerGiveItem(player, 'items.credit_card', 1, {
    bankCardInfo: {
      bankAccountNo: bankAccount.number,
      active: true,
      pinCode: generatePinCode()
    },
    expiringAt: dayjs().add(bankingConfig.DEFAULT_CREDIT_CARD_DAYS, 'days').toDate()
  });
};

export const getBankAccountTransactions = async (bankAccountId: string, filter: FilterQuery<Transaction> = {}) => {
  return TransactionModel.find({
    $or: [
      { bankAccount: bankAccountId },
      { targetBankAccount: bankAccountId }
    ],
    ...filter
  }).sort({ createdAt: -1 }).exec();
};

export const getBankAccountsByCharacter = (character: Character) => {
  return BankAccountModel.find({ character: character._id }).exec();
};


export const getBankCardsByNumber = async (bankAccountNo: string) => {
  return ItemModel.find({ 'bankCardInfo.bankAccountNo': bankAccountNo }).sort({ createdAt: -1 }).exec();
};

export const getBankAccountByNumber = (bankAccountNumber: string) => {
  return BankAccountModel.findOne({ number: bankAccountNumber });
};

export const setBankCardActive = async (item: Item, active: boolean) => {
  if (!item.bankCardInfo)
    return;

  item.bankCardInfo.active = active;
  await item.save();
  return item;
};

export const createBankTransaction = (bankAccount: BankAccount, type: TransactionType, amount: number, description: string, targetBankAccountId?: string) => {
  return TransactionModel.create({
    bankAccount,
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

export const playerWithdrawMoney = async (player: PlayerMp, type: 'bank' | 'atm' | 'online', bankAccountId: string, amount: number) => {
  const bankAccount = await getBankAccountById(bankAccountId);

  if (!bankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  const transaction = await createBankTransaction(bankAccount, TransactionType.Withdraw, amount, t('withdraw_transaction'));

  if (bankAccount.balance < amount) {
    throw new Error(t('insufficient_funds'));
  }

  if (type === 'atm' && amount > bankingConfig.ATM_MAX_WITHDRAW) {
    throw new Error(t('exceeded_max_withdraw', { amount }));
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


export const playerDepositMoney = async (player: PlayerMp, type: 'bank' | 'atm' | 'online', bankAccountId: string, amount: number) => {
  const bankAccount = await getBankAccountById(bankAccountId);

  if (!bankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  const transaction = await createBankTransaction(bankAccount, TransactionType.Deposit, amount, t('deposit_transaction'));

  if (player.character.cash < amount) {
    throw new Error(t('not_enough_money'));
  }

  if (amount < 0) {
    throw new Error(t('invalid_amount'));
  }

  if (type === 'atm' && amount > bankingConfig.ATM_MAX_DEPOSIT) {
    throw new Error(t('exceeded_max_deposit', { amount }));
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

  if (!targetBankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  if (bankAccount.number === targetAccountNumber) {
    throw new Error(t('cant_transfer_to_same_account'));
  }

  const transaction = await createBankTransaction(bankAccount, TransactionType.Transfer, amount, t('transfer_transaction'), targetBankAccount.id);

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


export const playerDeactivateBankCard = async (player: PlayerMp, bankCardItemId: string) => {
  const target = await getPlayerByItemId(bankCardItemId);

  if (!target) {
    const item = await getItemById(bankCardItemId);

    if (!item || !item.bankCardInfo) {
      throw new Error(t('bank_card_not_found'));
    }

    return setBankCardActive(item, false);
  } else {
    const item = getPlayerItemById(target, bankCardItemId);

    if (!item || !item.bankCardInfo) {
      throw new Error(t('bank_card_not_found'));
    }

    notifyPlayer(target, { severity: 'success', detail: t('bank_card_deactivated') });

    return setBankCardActive(item, false);
  }
};


export const playerCreateBankCard = async (player: PlayerMp, bankAccountId: string) => {
  const bankAccount = await getBankAccountById(bankAccountId);

  if (!bankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  const activeCard = await ItemModel.findOne({
    'bankCardInfo.bankAccountNo': bankAccount.number,
    'bankCardInfo.active': true
  }).sort({ createdAt: -1 });

  if (activeCard) {
    if (dayjs().diff(activeCard.createdAt, 'days') < bankingConfig.CREDIT_CARD_DAYS) {
      throw new Error(t('credit_card_create_every_days', { days: bankingConfig.CREDIT_CARD_DAYS }));
    }
  }

  const bankCard = await createBankCardItem(player, bankAccount);

  notifyPlayer(player, { severity: 'success', detail: t('bank_card_created') });

  return bankCard;
};


export const bankAccountPhoneLink = async (player: PlayerMp, bankAccountId: string, phoneNumber: string | null) => {
  const bankAccount = await getBankAccountById(bankAccountId);

  if (!bankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  if (phoneNumber && !/^\d{9,12}$/.test(phoneNumber)) {
    const phone = await getPhoneByPhoneNumber(phoneNumber);

    if (!phone) {
      throw new Error(t('invalid_phone_number'));
    }
  }

  bankAccount.phoneNumber = phoneNumber;
  await bankAccount.save();

  notifyPlayer(player, { severity: 'success', detail: t(phoneNumber ? 'bank_phone_linked' : 'bank_phone_unlinked') });

  return bankAccount;
};


export const makeOnlinePayment = async (player: PlayerMp, bankAccountNo: string, property: Property, amount: number) => {
  const bankAccount = await getBankAccountByNumber(bankAccountNo);

  if (!bankAccount) {
    throw new Error(t('bank_account_doesnt_exist'));
  }

  const transaction = await createBankTransaction(bankAccount, TransactionType.Payment, amount, t('online_commerce_payment', { property: property.name }));

  if (bankAccount.balance < amount) {
    throw new Error(t('insufficient_funds'));
  }

  transaction.property = property;
  transaction.status = TransactionStatus.Completed;

  bankAccount.balance -= amount;
  await bankAccount.save();

  const taxAmount = calculateTaxRate(property);
  property.balance = (property.balance + (amount - taxAmount));
  await property.save();

  notifyPlayer(player, { severity: 'success', detail: t('online_payment_success') });

  await transaction.save();

  return bankAccount;
};


export const isBankCardActive = (item: Item) => {
  return item.bankCardInfo?.active && dayjs().isBefore(dayjs(item.expiringAt));
};
