import { getIsAfk } from '../player/util/player-data.util';
import { triggerServer } from '@libertymp/rage-rpc';
import { PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';

const AFK_TIMEOUT = 1000;

function afkCheck() {
  const isAfk = getIsAfk();

  mp.gui.chat.push(`isAfk: ${isAfk}`);
  if (isAfk != undefined) {
    mp.gui.chat.push(`mp.system.isFocused: ${mp.system.isFocused}`);
    if (mp.system.isFocused != isAfk) {
      mp.gui.chat.push('triggering afk');
      triggerServer(ProcedureKey.SERVER_PLAYER_SET_VARIABLE, [PlayerSharedDataType.Afk, !mp.system.isFocused]);
    }
  }
}

setInterval(afkCheck, AFK_TIMEOUT);
