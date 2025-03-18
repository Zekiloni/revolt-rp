import { t } from 'i18next';
import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { BankAccountType, catchError, IBankInteraction, IBankPhoneLink, ProcedureKey } from '@revolt-rp/common';
import {
  bankAccountPhoneLink,
  createBankAccount, getBankAccountByNumber,
  getBankAccountsByCharacter, getBankAccountTransactions, getBankCardsByNumber,
  getSavingAccountByCharacter, playerCreateBankCard, playerDeactivateBankCard, playerDepositMoney, playerTransferMoney,
  playerWithdrawMoney
} from './banking.service';
import { notifyPlayer, sendInfoMessage } from '../player/util/player-notify.util';
import { giveMoney } from '../player/character/character.service';
import { bankingConfig } from './banking.config';
import { FilterQuery } from 'mongoose';
import { Transaction } from './transaction.model';


async function playerCreateSavingAccountHandler(balance: number, { player }: ProcedureListenerInfo<PlayerMp>) {
  const savingAccountExist = await getSavingAccountByCharacter(player.character);

  if (savingAccountExist) {
    return notifyPlayer(player, {
      severity: 'error',
      summary: t('bad_request'),
      detail: t('saving_account_already_exist')
    });
  }

  if (balance < bankingConfig.MIN_SAVING_ACCOUNT_BALANCE) {
    return notifyPlayer(player, {
      severity: 'error',
      summary: t('bad_request'),
      detail: t('savings_min_balance', { balance: bankingConfig.MIN_SAVING_ACCOUNT_BALANCE })
    });
  }

  const bankAccount = await createBankAccount(player.character, BankAccountType.Savings, balance);
  await giveMoney(player, -balance);

  notifyPlayer(player, { severity: 'success', summary: t('success'), detail: t('saving_account_created') });

  sendInfoMessage(player, t('bank_account_number_info', { number: bankAccount.number }));
}

function playerGetBankAccountsHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  return getBankAccountsByCharacter(player.character);
}

async function playerWithdrawMoneyHandler(data: IBankInteraction, { player }: ProcedureListenerInfo<PlayerMp>) {
  return playerWithdrawMoney(player, data.type, data.bankAccountId, data.amount)
    .then(bankAccount => bankAccount)
    .catch(catchError);
}

async function playerDepositMoneyHandler(data: IBankInteraction, { player }: ProcedureListenerInfo<PlayerMp>) {
  return playerDepositMoney(player, data.type, data.bankAccountId, data.amount)
    .then(bankAccount => bankAccount)
    .catch(catchError);
}

async function bankGetTransactionsHandler(query: { bankAccountId: string, filter?: FilterQuery<Transaction> }) {
  return getBankAccountTransactions(query.bankAccountId, query.filter ?? {})
    .then(transactions => transactions)
    .catch(catchError);
}

async function playerTransferMoneyHandler(data: IBankInteraction, { player }: ProcedureListenerInfo<PlayerMp>) {
  return playerTransferMoney(player, data.bankAccountId, data.targetAccountNumber, data.amount)
    .then(bankAccount => bankAccount)
    .catch(catchError);
}

function playerGetBankAccountByNumberHandler(bankAccountNumber: string) {
  return getBankAccountByNumber(bankAccountNumber);
}

function playerBankGetCardsHandler(bankAccountNo: string) {
  return getBankCardsByNumber(bankAccountNo);
}

async function playerBankCardDeactivateHandler(bankCardItemId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  return playerDeactivateBankCard(player, bankCardItemId)
    .then(bankCard => bankCard)
    .catch(catchError);
}

async function playerCreateBankCardHandler(bankAccountId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  return playerCreateBankCard(player, bankAccountId)
    .then(bankCard => bankCard)
    .catch(catchError);

}

async function updateBankAccountPhoneNumber(linkBankAccount: IBankPhoneLink, { player }: ProcedureListenerInfo<PlayerMp>) {
  return bankAccountPhoneLink(player, linkBankAccount.bankAccountId, linkBankAccount.phoneNumber)
    .then(bankAccount => bankAccount)
    .catch(catchError);
}

on(ProcedureKey.SERVER_PLAYER_CREATE_SAVING_ACCOUNT, playerCreateSavingAccountHandler);
register(ProcedureKey.SERVER_PLAYER_BANK_GET_ACCOUNTS, playerGetBankAccountsHandler);
register(ProcedureKey.SERVER_PLAYER_BANK_GET_ACCOUNT, playerGetBankAccountByNumberHandler);
register(ProcedureKey.SERVER_PLAYER_WITHDRAW_MONEY, playerWithdrawMoneyHandler);
register(ProcedureKey.SERVER_PLAYER_DEPOSIT_MONEY, playerDepositMoneyHandler);
register(ProcedureKey.SERVER_PLAYER_TRANSFER_MONEY, playerTransferMoneyHandler);
register(ProcedureKey.SERVER_BANK_GET_TRANSACTIONS, bankGetTransactionsHandler);
register(ProcedureKey.SERVER_PLAYER_BANK_GET_CARDS, playerBankGetCardsHandler);
register(ProcedureKey.SERVER_PLAYER_BANK_DEACTIVATE_CARD, playerBankCardDeactivateHandler);
register(ProcedureKey.SERVER_PLAYER_BANK_CREATE_CARD, playerCreateBankCardHandler);
register(ProcedureKey.SERVER_BANK_UPDATE_PHONE, updateBankAccountPhoneNumber);
