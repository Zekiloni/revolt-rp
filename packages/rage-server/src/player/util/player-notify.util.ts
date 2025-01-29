import { Message } from 'primeng/api';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { hexColors, ProcedureKey } from '@revolt-rp/common';


export const notifyPlayer = (player: PlayerMp, message: Message) => {
  triggerBrowsers(player, ProcedureKey.BROWSER_NOTIFICATION, message);
};


export const sendInfoMessage = (player: PlayerMp, message: string) => {
  player.outputChatBox(`!{${hexColors.DEEP_FRIED}}[info]: !{${hexColors.WHITE_SMOKE}}${message}`);
};
