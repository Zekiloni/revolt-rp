import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { getPlayerSelectedItem } from '../player-inventory.service';
import { playerTogglePhone } from './player-phone.service';


async function playerTogglePhoneHandler(toggle: boolean, { player }: ProcedureListenerInfo<PlayerMp>) {
  const phoneItem = getPlayerSelectedItem(player);

  if (!phoneItem) {
    return;
  }

  await playerTogglePhone(player, phoneItem, toggle);
}


on(ProcedureKey.SERVER_TOGGLE_PHONE, playerTogglePhoneHandler);
