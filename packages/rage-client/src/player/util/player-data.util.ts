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
  return getTarget(target).getVariable(PlayerSharedDataType.IsSpawned) ?? false;
}

export const getIsCuffed = (target?: PlayerMp) => {
  return getTarget(target).getVariable(PlayerSharedDataType.IsRestrained);
}

export const getIsNotCuffed = (target?: PlayerMp) => {
  return getTarget(target).getVariable(PlayerSharedDataType.IsRestrained) == false;
}

export const getIsAlive = (target?: PlayerMp) => {
  return getTarget(target).getVariable(PlayerSharedDataType.State) == CharacterStateType.ALIVE;
}

export const getIsFrozen = (target?: PlayerMp): boolean => {
  return getTarget(target).getVariable(PlayerSharedDataType.Frozen);

}
