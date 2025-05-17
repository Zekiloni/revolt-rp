import { registerCommand } from './player/player-command.service';
import { showPlayerGameInterface } from './player/util/player.util';
import { GameUiKey, PlayerSharedDataType } from '@revolt-rp/common';

registerCommand({
  name: 'mdc',
  description: 'test mdc',
  handle(player: PlayerMp, ...args) {
    showPlayerGameInterface(player, GameUiKey.MDC);
  }
});

registerCommand({
  name: 'highlighttarget',
  description: 'test highlighttarget command',
  handle(player: PlayerMp, ...args) {
    const variable = player.getVariable<boolean | undefined>(PlayerSharedDataType.HighlightTarget) || false;
    player.setVariable(PlayerSharedDataType.HighlightTarget, !variable);
  }
});
