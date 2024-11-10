import { PlayerSharedDataType } from '@bcrp-rage/common';
import { getIsFrozen } from '../util/player-data.util';


export const setPlayerFreeze = (player: PlayerMp, toggle: boolean) => {
  player.freezePosition(toggle);
  if (player.vehicle) {
    player.vehicle.freezePosition(toggle);
  }
};

function freezeDataHandler(entity: EntityMp, value: boolean, oldValue: boolean) {
  if (entity.type != RageEnums.EntityType.PLAYER)
    return;

  if (value != undefined && value != oldValue) {
    setPlayerFreeze(entity as PlayerMp, value);
  }
}

function entityStreamInFreezeHandler(entity: EntityMp) {
  if (entity.type != RageEnums.EntityType.PLAYER && entity.type != RageEnums.EntityType.VEHICLE) {
    return;
  }

  const isFrozen = getIsFrozen(entity as PlayerMp);

  if (isFrozen != undefined) {
    setPlayerFreeze(entity as PlayerMp, isFrozen);
  }
}

mp.events.addDataHandler(PlayerSharedDataType.Frozen, freezeDataHandler);
mp.events.add({
  entityStreamIn: entityStreamInFreezeHandler
});
