import { register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { waitForObjectToLoad } from '../../util/object.util';
import { onMouseClick } from '../../util/click.util';

let object: ObjectMp | null = null;
let updateInterval: NodeJS.Timeout | null = null;

function updateObjectPosition() {
  if (object && mp.objects.exists(object)) {
    const playerPos = mp.players.local.position;
    const forwardVector = mp.players.local.getForwardVector();
    const offset = 1.0; // Distance in front of the player

    const newPos = new mp.Vector3(
      playerPos.x + forwardVector.x * offset,
      playerPos.y + forwardVector.y * offset,
      playerPos.z
    );

    object.setCoordsNoOffset(newPos.x, newPos.y, newPos.z, true, true, true);
    object.placeOnGroundProperly();
  }
}

async function deployItemHandler(model: string) {
  let lastPosition: Vector3 | null = null;
  let lastRotation: Vector3 | null = null;
  if (object && mp.objects.exists(object)) {
    lastPosition = object.getCoords(false);
    lastRotation = object.getRotation(2);
    object.destroy();
    object = null;
  }

  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }

  object = mp.objects.new(mp.game.joaat(model),
    lastPosition || mp.players.local.position,
    {
      rotation: lastRotation || mp.players.local.getRotation(2),
      dimension: mp.players.local.dimension
    }
  );

  await waitForObjectToLoad(object);
  object.placeOnGroundProperly();
  object.setCollision(false, true);

  updateInterval = setInterval(updateObjectPosition, 250);

  return new Promise<[Vector3, Vector3]>(resolve => {
    onMouseClick('left', 'down', () => {
      if (!object || !mp.objects.exists(object)) return;

      const data: [Vector3, Vector3] = [
        object.getCoords(false),
        object.getRotation(2)
      ];

      object.destroy();
      object = null;

      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }

      resolve(data);
    }, true);
  });
}

register(ProcedureKey.CLIENT_PLAYER_DEPLOY_ITEM, deployItemHandler);
