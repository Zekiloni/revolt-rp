import { t } from 'i18next';
import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { BankAccountType, ProcedureKey } from '@revolt-rp/common';
import { createBankAccount, getSavingAccountByCharacter } from './banking.service';
import { notifyPlayer, sendInfoMessage } from '../player/util/player-notify.util';


async function playerCreateSavingAccount(balance: number, { player }: ProcedureListenerInfo<PlayerMp>) {
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

on(ProcedureKey.SERVER_PLAYER_CREATE_SAVING_ACCOUNT, playerCreateSavingAccount);
