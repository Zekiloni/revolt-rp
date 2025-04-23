import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { IOnlinePlayer, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';


function playerGetVariableHandler(variable: string | PlayerSharedDataType, { player }: ProcedureListenerInfo<PlayerMp>) {
  return player.getVariable(variable);
}

function playerSetVariableHandler(data: [string | PlayerSharedDataType, unknown], { player }: ProcedureListenerInfo<PlayerMp>) {
  const [variable, value] = data;
  player.setVariable(variable, value);
}

function getPlayersHandler(): IOnlinePlayer[] {
  return mp.players.toArray()
    .filter(player => player.account != undefined)
    .map((player) => ({
      id: player.id,
      name: player.name,
      username: player.account.username,
      administrator: player.account.administrator,
      ping: player.ping
    }));
}

register(ProcedureKey.SERVER_PLAYER_GET_VARIABLE, playerGetVariableHandler);
register(ProcedureKey.SERVER_GET_PLAYERS, getPlayersHandler);
on(ProcedureKey.SERVER_PLAYER_SET_VARIABLE, playerSetVariableHandler);
