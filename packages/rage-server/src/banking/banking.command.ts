import { registerCommand } from '../player/player-command.service';
import { triggerClient } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';


// TODO: check for bank positions, etc.
registerCommand({
  name: 'bank',
  description: 'Banking system',
  handle(player: PlayerMp) {
    triggerClient(player, ProcedureKey.CLIENT_PLAYER_TOGGLE_BANK_MENU, true);
  }
})
