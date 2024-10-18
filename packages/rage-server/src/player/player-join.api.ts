import { triggerClient } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@bcrp-rage/common';

mp.events.add({
  incomingConnection: incomingConnectionHandler,
  playerJoin: playerJoinHandler,
  playerReady: playerReadyHandler
});

function playerJoinHandler(player: PlayerMp) {
  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION);
}

function playerReadyHandler(player: PlayerMp) {

}

function incomingConnectionHandler(ip: string, serial: string, rgscName: string, rgscId: string, gameType: string) {
  console.log('New incoming connection from ' + ip);
}
