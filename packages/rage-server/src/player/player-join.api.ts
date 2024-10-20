import { triggerClient } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@bcrp-rage/common';

mp.events.add({
  incomingConnection: incomingConnectionHandler,
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

function incomingConnectionHandler(ip: string, serial: string, rgscName: string, rgscId: string, gameType: string) {
  console.log('New incoming connection from ' + ip);
}
