import { triggerClient } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { checkPlayerBan, kickPlayer } from './admin/moderation.service';
import { proxyCheck } from '../util/ip.util';


function playerJoinHandler(player: PlayerMp) {
  player.dimension = (player.id + 100);
  player.alpha = 0;
}

const togglePlayerAuthorization = (player: PlayerMp, toggle: boolean)=> {
  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION, toggle);
}

async function playerReadyHandler(player: PlayerMp) {
  const isProxy = proxyCheck(player.ip);

  // TODO: fix localhost proxy detection
  // if (isProxy)
  //   return kickPlayer(player, 'Proxy/VPN connections are not allowed.');

  const ban = await checkPlayerBan(player);

  if (!ban)
    togglePlayerAuthorization(player, true);
}

mp.events.add({
  playerJoin: playerJoinHandler,
  playerReady: playerReadyHandler
});
