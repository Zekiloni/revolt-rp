import { CharacterStateType, PlayerSharedDataType } from '@bcrp-rage/common';


function getTarget(target: PlayerMp) {
  return target ? target : mp.players.local;
}

export const getCash = (target?: PlayerMp) => {
  return getTarget(target).getVariable(PlayerSharedDataType.Cash);
}

export const getAdministrator = (target?: PlayerMp) => {
  return getTarget(target).getVariable(PlayerSharedDataType.Administrator);
}

export const getIsSpawned = (target?: PlayerMp) => {
  return getTarget(target).getVariable(PlayerSharedDataType.IsSpawned);
}

export const getIsCuffed = (target?: PlayerMp) => {
  return getTarget(target).getVariable(PlayerSharedDataType.IsCuffed);
}

export const getIsAlive = (target?: PlayerMp) => {
  return getTarget(target).getVariable(PlayerSharedDataType.State) == CharacterStateType.ALIVE;
}
