import { Message } from 'primeng/api';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@bcrp-rage/common';


export const notifyPlayer = (player: PlayerMp, message: Message) => {
  triggerBrowsers(player, ProcedureKey.BROWSER_NOTIFICATION, message);
};
