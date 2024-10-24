import { hexColors } from '@bcrp-rage/common';
import { registerCommand } from './player-command.service';
import { sendProximityMessage } from './player.util';

registerCommand({
  name: 'me',
  params: [{ name: 'action', type: 'string'}],
  description: 'action',
  handle(player: PlayerMp, ...args) {
    const content = [...args].join(' ');
    sendProximityMessage(content, player.position, 10, hexColors.PURPLE);
  }
})
