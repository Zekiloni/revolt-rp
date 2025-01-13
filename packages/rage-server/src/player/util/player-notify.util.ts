import { Message } from 'primeng/api';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';


export const notifyPlayer = (player: PlayerMp, message: Message) => {
  triggerBrowsers(player, ProcedureKey.BROWSER_NOTIFICATION, message);
};
