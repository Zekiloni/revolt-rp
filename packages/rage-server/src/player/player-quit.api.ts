async function playerQuitHandler(player: PlayerMp, exitType: string, reason?: string) {
  mp.events.delayTermination = true;

  const { account, character, position, heading, dimension } = player;

  if (account) {
    await account.save();

    if (character) {

      // TODO: create label that will expire after some time foreach player in range

      character.position = position;
      character.dimension = dimension;
      character.heading = heading;
      character.lastSessionAt = new Date();

      await character.save();
    }
  }
  mp.events.delayTermination = false;
}

mp.events.add({
  playerQuit: playerQuitHandler
});
