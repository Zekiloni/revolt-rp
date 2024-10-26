async function playerQuitHandler(player: PlayerMp, exitType: string, reason: string) {
  if (player.account) {
    await player.account.save();

    if (player.character)
      await player.character.save();
  }
}

mp.events.add({
  playerQuit: playerQuitHandler
})
