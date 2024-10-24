import { getCommand } from './player-command.service';


function playerCommandHandler(player: PlayerMp, fullCommand: string) {
  const args = fullCommand.split(/ +/);
  const commandKey = args.splice(0, 1)[0];

  const command = getCommand(commandKey);

  if (!command)
    return; // MSG command not found

  if (command.administrator && player.account.administrator < command.administrator) {
    // if player.administrator < command.administrator
    return;
  }

  if (command.validators && command.validators.length) {
    command.validators.forEach((validator) => {
      if (!validator.validate(player)) {
        // throw commandValidator.message
        return;
      }
    })
  }

  command.handle(player, ...args as never[]);
}

mp.events.add({
  playerCommand: playerCommandHandler
});
