import { registerCommand } from './player/player-command.service';
import { showPlayerGameInterface } from './player/util/player.util';
import { GameUiKey } from '@revolt-rp/common';

registerCommand({
  name: 'mdc',
  description: 'test mdc',
  handle(player: PlayerMp, ...args) {
    showPlayerGameInterface(player, GameUiKey.MDC);
  }
});
