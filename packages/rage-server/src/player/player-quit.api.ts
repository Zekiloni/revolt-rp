async function playerQuitHandler(player: PlayerMp, exitType: string, reason?: string) {
  mp.events.delayTermination = true;

  const { account, character, position, heading, dimension } = player;

  console.log('player quit');
  if (account) {
    console.log('before', account);
    await account.save();
    console.log('player after account save');

    if (character) {

      // TODO: create label that will expire after some time foreach player in range

      character.position = position;
      character.dimension = dimension;
      character.heading = heading;
      character.lastSessionAt = new Date();

      await character.save();
      console.log('player after character save', character);

    }
  }
  mp.events.delayTermination = false;
}

mp.events.add({
  playerQuit: playerQuitHandler
});
