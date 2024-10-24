import { hexColors } from '@bcrp-rage/common';
import { registerCommand } from './player-command.service';
import { sendProximityMessage } from './player.util';

registerCommand({
  name: 'me',
  params: ['action'],
  description: 'action',
  handle(player: PlayerMp, ...args) {
    console.log('me', ...args);
    const content = `* ${player.name} ${[...args].join(' ')}`;
    sendProximityMessage(content, player.position, 10, hexColors.PURPLE);
  }
});
