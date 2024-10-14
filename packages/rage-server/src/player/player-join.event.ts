
mp.events.add({
  incomingConnection: incomingConnectionHandler,
  playerJoin: playerJoinHandler,
  playerReady: playerReadyHandler
});

function playerJoinHandler(player: PlayerMp) {
}

function playerReadyHandler(player: PlayerMp) {

}

function incomingConnectionHandler(ip: string, serial: string, rgscName: string, rgscId: string, gameType: string) {
  console.log('New incoming connection from ' + ip);
}
