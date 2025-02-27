function playerEnterColshapeHandler(player: PlayerMp, colshape: ColshapeMp) {
  if (colshape.onPlayerExit) {
    colshape.onPlayerEnter(player);
  }
}

function playerExitColshapeHandler(player: PlayerMp, colshape: ColshapeMp) {
  if (colshape.onPlayerExit) {
    colshape.onPlayerExit(player);
  }
}


mp.events.add({
  playerEnterColshape: playerEnterColshapeHandler,
  playerExitColshape: playerExitColshapeHandler
});
