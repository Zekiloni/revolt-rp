import './gang-record/gang-record.api';
import './criminal-record/criminal-record.api';
import { registerCommand } from '../../player/player-command.service';
import { showPlayerGameInterface } from '../../player/util/player.util';
import { GameUiKey } from '@revolt-rp/common';


registerCommand({
  name: 'mdc',
  description: 'test cmd',
  handle(player: PlayerMp, ...args) {
    showPlayerGameInterface(player, GameUiKey.MDC);
  }
});
