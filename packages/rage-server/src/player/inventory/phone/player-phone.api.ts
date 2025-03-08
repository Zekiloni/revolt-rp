import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { PlayerPhoneState, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { getPlayerSelectedItem } from '../player-inventory.service';
import { playerTogglePhone } from './player-phone.service';


async function playerTogglePhoneHandler(toggle: boolean, { player }: ProcedureListenerInfo<PlayerMp>) {
  const phoneItem = getPlayerSelectedItem(player);

  if (!phoneItem) {
    return;
  }

  await playerTogglePhone(player, phoneItem, toggle);
}

function playerSetPhoneStateHandler(state: PlayerPhoneState | null, { player }: ProcedureListenerInfo<PlayerMp>) {
  player.setVariable(PlayerSharedDataType.PhoneState, state);
}

on(ProcedureKey.SERVER_TOGGLE_PHONE, playerTogglePhoneHandler);
on(ProcedureKey.SERVER_SET_PHONE_STATE, playerSetPhoneStateHandler);
