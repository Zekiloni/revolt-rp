import { on } from '@libertymp/rage-rpc';
import { GameUiKey, ProcedureKey } from '@revolt-rp/common';
import { hideGameInterface, showGameInterface } from '../core/browser';


function toggleBankMenu(toggle: boolean) {
  if (toggle) {
    showGameInterface(GameUiKey.BankMenu);
  } else {
    hideGameInterface(GameUiKey.BankMenu);
  }
}

on(ProcedureKey.CLIENT_PLAYER_TOGGLE_BANK_MENU, toggleBankMenu);
