import { getIsAfk } from '../player/util/player-data.util';
import { triggerServer } from '@libertymp/rage-rpc';
import { PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';

const AFK_CHECK_TIMEOUT = 1000;

function afkCheck() {
  const afkState = getIsAfk();
  const newAfkState = !mp.system.isFocused;

  if (afkState === undefined)
    return;

  mp.gui.chat.push(`afkState: ${afkState}, newAfkState: ${newAfkState}`);
  if (afkState != newAfkState) {
    if (mp.system.isFocused != !afkState) {
      mp.gui.chat.push('triggering afk state update');
      triggerServer(ProcedureKey.SERVER_PLAYER_SET_VARIABLE, [PlayerSharedDataType.Afk, newAfkState]);
    }
  }
}

setInterval(afkCheck, AFK_CHECK_TIMEOUT);
