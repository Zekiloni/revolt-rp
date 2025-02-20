import { register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { getIsSpawned } from './util/player-data.util';
import { getDistance } from '../util/vector.util';
import { filterPlayer } from '../../../rage-server/src/player/util/player.util';

const P2P_INTERACTION_MAX_DIST = 2.0;

function isPlayerNearPlayer(target: PlayerMp) {
  return getDistance(mp.players.local.position, target.position) < P2P_INTERACTION_MAX_DIST && mp.players.local.dimension === target.dimension;
}


function getNearbyPlayersHandler() {
  if (!mp.players.length)
    return [];

  return mp.players.toArray()
    .filter(target => getIsSpawned(target) && isPlayerNearPlayer(target))
    .filter(target => target.handle !== mp.players.local.handle)
    .map(target => ({ value: target.remoteId, label: target.name }));
}

function filterPlayersHandler(query: string) {
  if (!mp.players.length)
    return [];

  if (!isNaN(+query)) {
    const id = +query;
    if (id === mp.players.local.remoteId)
      return [];

    const target = mp.players.atRemoteId(id);

    if (target && getIsSpawned(target))
      return [{ value: target.remoteId, label: target.name }];
  }


  return mp.players.toArray()
    .filter(target => getIsSpawned(target))
    .filter(target => target.handle !== mp.players.local.handle)
    .map(target => ({ value: target.remoteId, label: target.name }));
}


register(ProcedureKey.CLIENT_GET_NEARBY_PLAYERS, getNearbyPlayersHandler);
register(ProcedureKey.CLIENT_FILTER_PLAYERS, filterPlayersHandler);
