import { t } from 'i18next';
import { getBaseCommands, getCommand } from './player-command.service';
import { notifyPlayer } from './util/player-notify.util';
import { register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';


function playerCommandHandler(player: PlayerMp, fullCommand: string) {
  const args = fullCommand.split(/ +/);
  const commandKey = args.splice(0, 1)[0];

  const command = getCommand(commandKey.toLowerCase());

  if (!command)
    return notifyPlayer(player, {
      severity: 'error',
      detail: t('command_not_found', { command: commandKey }),
      summary: t('not_found')
    });


  if (command.params && args && args.length < command.params.length) {
    const usage = `${command.name} [${command.params.join('] [')}]`;
    return notifyPlayer(player, { severity: 'warn', summary: t('bad_request'), detail: t('command_usage', { usage }) });
  }

  if (command.administrator && player.account.administrator < command.administrator) {
    notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('not_authorized') });
    return;
  }


  if (command.validators && command.validators.length) {
    for (const validator of command.validators) {
      if (!validator.validate(player)) {
        notifyPlayer(player, { severity: 'error', summary: t('error'), detail: validator.message });
        return;
      }
    }
  }

  command.handle(player, ...args);
}

function getCommandsHandler() {
  return getBaseCommands();
}

mp.events.add({
  playerCommand: playerCommandHandler
});

register(ProcedureKey.SERVER_GET_COMMANDS, getCommandsHandler);
