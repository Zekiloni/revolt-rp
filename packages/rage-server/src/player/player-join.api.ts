import { triggerClient } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { checkPlayerBan } from './admin/moderation/moderation.service';


function playerJoinHandler(player: PlayerMp) {
  player.dimension = (player.id + 100);
  player.alpha = 0;
}

async function playerReadyHandler(player: PlayerMp) {
  const ban = await checkPlayerBan(player);

  if (!ban)
    triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION, true);
}

mp.events.add({
  playerJoin: playerJoinHandler,
  playerReady: playerReadyHandler
});
