import { t } from 'i18next';
import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { BankAccountType, catchError, IBankInteraction, ProcedureKey } from '@revolt-rp/common';
import {
  createBankAccount, getBankAccountByNumber,
  getBankAccountsByCharacter, getBankAccountTransactions,
  getSavingAccountByCharacter, playerDepositMoney, playerTransferMoney,
  playerWithdrawMoney
} from './banking.service';
import { notifyPlayer, sendInfoMessage } from '../player/util/player-notify.util';


async function playerCreateSavingAccountHandler(balance: number, { player }: ProcedureListenerInfo<PlayerMp>) {
  const savingAccountExist = await getSavingAccountByCharacter(player.character);

  if (savingAccountExist) {
    return notifyPlayer(player, {
      severity: 'error',
      summary: t('bad_request'),
      detail: t('saving_account_already_exist')
    });
  }

  const bankAccount = await createBankAccount(player.character, BankAccountType.Savings, balance);
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

function playerBankGetTransactionsHandler(bankAccountId: string) {
  return getBankAccountTransactions(bankAccountId);
}

async function playerTransferMoneyHandler(data: IBankInteraction, { player }: ProcedureListenerInfo<PlayerMp>) {
  return playerTransferMoney(player, data.bankAccountId, data.targetAccountNumber, data.amount)
    .then(bankAccount => bankAccount)
    .catch(catchError);
}

function playerGetBankAccountByNumberHandler(bankAccountNumber: string) {
  return getBankAccountByNumber(bankAccountNumber)
}

on(ProcedureKey.SERVER_PLAYER_CREATE_SAVING_ACCOUNT, playerCreateSavingAccountHandler);
register(ProcedureKey.SERVER_PLAYER_BANK_GET_ACCOUNTS, playerGetBankAccountsHandler);
register(ProcedureKey.SERVER_PLAYER_BANK_GET_ACCOUNT, playerGetBankAccountByNumberHandler);
register(ProcedureKey.SERVER_PLAYER_WITHDRAW_MONEY, playerWithdrawMoneyHandler);
register(ProcedureKey.SERVER_PLAYER_DEPOSIT_MONEY, playerDepositMoneyHandler);
register(ProcedureKey.SERVER_PLAYER_TRANSFER_MONEY, playerTransferMoneyHandler);
register(ProcedureKey.SERVER_PLAYER_BANK_GET_TRANSACTIONS, playerBankGetTransactionsHandler);
