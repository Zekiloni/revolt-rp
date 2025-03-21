import { getIsAfk } from '../player/util/player-data.util';
import { triggerServer } from '@libertymp/rage-rpc';
import { PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';

const AFK_TIMEOUT = 1000;

function afkCheck() {
  const isAfk = getIsAfk();

  if (isAfk != undefined) {
    if (mp.system.isFocused != isAfk) {
      triggerServer(ProcedureKey.SERVER_PLAYER_SET_VARIABLE, [PlayerSharedDataType.Afk, !mp.system.isFocused]);
    }
  }
}

setInterval(afkCheck, AFK_TIMEOUT);
