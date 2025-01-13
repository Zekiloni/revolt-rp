import { triggerClient } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';

mp.events.add({
  playerJoin: playerJoinHandler,
  playerReady: playerReadyHandler
});

function playerJoinHandler(player: PlayerMp) {
  player.dimension = (player.id + 100);
  player.alpha = 0;
}

function playerReadyHandler(player: PlayerMp) {
  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION, true);
}
