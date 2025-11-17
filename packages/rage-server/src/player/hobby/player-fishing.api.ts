import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { playerCatchFish, playerFishResponse } from './player-fishing.service';


const playerFishResponseHandler = (response: boolean, { player }: ProcedureListenerInfo<PlayerMp>) => {
  return playerFishResponse(player, response);
}

const playerCatchFishHandler = (params: undefined, { player }: ProcedureListenerInfo<PlayerMp>) => {
  return playerCatchFish(player);
}

register(ProcedureKey.SERVER_PLAYER_CATCH_FISH, playerCatchFishHandler);
on(ProcedureKey.SERVER_PLAYER_FISH_RESPONSE,  playerFishResponseHandler)
