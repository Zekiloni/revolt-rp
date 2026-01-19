import { register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { waitForObjectToLoad } from '../../util/object.util';

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
  }
}

setInterval(updateObjectPosition, 100); // Update position every 100 ms
async function deployItemHandler(model: string | null) {
  if (!model) {
    if (object && mp.objects.exists(object)) {
      object.destroy();
    }

    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  } else {
    object = mp.objects.new(mp.game.joaat(model),
      mp.players.local.position,
      {
        rotation: new mp.Vector3(0, 0, 0),
        dimension: mp.players.local.dimension
      }
    );

    await waitForObjectToLoad(object);
    object.placeOnGroundProperly();

    updateInterval = setInterval(updateObjectPosition, 250);
  }
}

register(ProcedureKey.CLIENT_PLAYER_DEPLOY_ITEM, deployItemHandler);
