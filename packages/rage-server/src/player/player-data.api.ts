import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';


function playerGetVariableHandler(variable: string | PlayerSharedDataType, { player }: ProcedureListenerInfo<PlayerMp>) {
  return player.getVariable(variable);
}

function playerSetVariableHandler(data: [string | PlayerSharedDataType, unknown], { player }: ProcedureListenerInfo<PlayerMp>) {
  const [variable, value] = data;
  player.setVariable(variable, value);
}

register(ProcedureKey.SERVER_PLAYER_GET_VARIABLE, playerGetVariableHandler);
on(ProcedureKey.SERVER_PLAYER_SET_VARIABLE, playerSetVariableHandler);
