import { on } from '@libertymp/rage-rpc';
import { IDoor, isDoorPopulated, ProcedureKey } from '@revolt-rp/common';

export const detectDoorObject = () => {
  const entityFound = mp.game.player.getEntityIsFreeAimingAt();
  if (entityFound) {
    const handle = (entityFound as EntityMp)?.handle ?? (entityFound as number);
    const hash = mp.game.entity.getModel(handle);
    const position = mp.game.entity.getCoords(handle, false);
    return { handle, hash, position, dimension: mp.players.local.dimension };
  }
  return null;
};


on(ProcedureKey.CLIENT_DOORS_SYNC, (door: IDoor) => {
  const visited = new Set<string>();

  function syncDoor(d: IDoor) {
    if (visited.has(d.id)) return;
    visited.add(d.id);

    const { x, y, z } = d.position;
    mp.game.object.setStateOfClosestDoorOfType(d.hash, x, y, z, closed, 0, false);

    if (isDoorPopulated(d.parent)) {
      syncDoor(d.parent);
    }
  }

  syncDoor(door);
});
