import { on } from '@libertymp/rage-rpc';
import { IDoorObject, isPopulated, ProcedureKey } from '@revolt-rp/common';

// export const detectDoorObject = () => {
//   const entityFound = mp.game.player.getEntityIsFreeAimingAt();
//   if (entityFound) {
//     const handle = (entityFound as EntityMp)?.handle ?? (entityFound as number);
//     const hash = mp.game.entity.getModel(handle);
//     const position = mp.game.entity.getCoords(handle, false);
//     const rotation = mp.game.entity.getRotation(handle, 2);
//     return { handle, hash, position, rotation, dimension: mp.players.local.dimension };
//   }
//   return null;
// };


function syncDoor(door: IDoorObject) {
  const visited = new Set<string>();

  function handle(d: IDoorObject) {
    if (visited.has(d.id)) return;
    visited.add(d.id);

    const { x, y, z } = d.position;
    mp.game.object.setStateOfClosestDoorOfType(d.hash, x, y, z, closed, 0, false);

    if (d.parent && isPopulated(d.parent, 'hash')) {
      handle(d.parent);
    }
  }

  handle(door);
}

on(ProcedureKey.CLIENT_DOORS_SYNC, syncDoor);
