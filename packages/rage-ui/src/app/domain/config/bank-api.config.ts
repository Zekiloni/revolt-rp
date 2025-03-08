import { ProcedureKey } from '@revolt-rp/common';
import { BankActionType } from '../../component/banking/bank-menu/component/bank-action-input';

export const BANK_API_EVENTS = {
  [BankActionType.Deposit]: ProcedureKey.SERVER_PLAYER_DEPOSIT_MONEY,
  [BankActionType.Withdraw]: ProcedureKey.SERVER_PLAYER_WITHDRAW_MONEY,
  [BankActionType.Transfer]: ProcedureKey.SERVER_PLAYER_TRANSFER_MONEY
};
