import { Message } from 'primeng/api';
import { triggerBrowsers, triggerClient } from '@libertymp/rage-rpc';
import { GameUiKey, hexColors, ProcedureKey } from '@revolt-rp/common';


export const notifyPlayer = (player: PlayerMp, message: Message) => {
  triggerBrowsers(player, ProcedureKey.BROWSER_NOTIFICATION, message);
};


export const sendInfoMessage = (player: PlayerMp, message: string) => {
  player.outputChatBox(`!{${hexColors.DEEP_FRIED}}[info]: !{${hexColors.WHITE_SMOKE}}${message}`);
};

export const sendOrganizationMessage = (player: PlayerMp, hexColor: string, message: string) => {
  const color = hexColor.replace(/#/g, '');
  player.outputChatBox(`!{${color}}${message}`);
};


export const showPlayerGameInterface = (player: PlayerMp, gameUiKey: GameUiKey, initCallback?: () => void) => {
  triggerClient(player, ProcedureKey.CLIENT_PLAYER_SHOW_INTERFACE, gameUiKey);

  if (initCallback) {
    setTimeout(() => {
      if (player && mp.players.exists(player)) {
        initCallback();
      }
    }, 200);
  }
};

export const hidePlayerGameInterface = (player: PlayerMp, gameUiKey: GameUiKey) => {
  triggerClient(player, ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, gameUiKey);
}

