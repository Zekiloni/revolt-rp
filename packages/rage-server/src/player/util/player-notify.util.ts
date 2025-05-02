import { triggerBrowsers } from '@libertymp/rage-rpc';
import { hexColors, ProcedureKey } from '@revolt-rp/common';


export interface IMessage {
  severity: 'success' | 'error' | 'info' | 'warn';
  summary?: string;
  detail?: string;
}

export const notifyPlayer = (player: PlayerMp, message: IMessage) => {
  triggerBrowsers(player, ProcedureKey.BROWSER_NOTIFICATION, message);
};


export const sendInfoMessage = (player: PlayerMp, message: string) => {
  player.outputChatBox(`!{${hexColors.DEEP_FRIED}}[info]: !{${hexColors.WHITE_SMOKE}}${message}`);
};

export const sendOrganizationMessage = (player: PlayerMp, hexColor: string, message: string) => {
  const color = hexColor.replace(/#/g, '');
  player.outputChatBox(`!{${color}}${message}`);
};


