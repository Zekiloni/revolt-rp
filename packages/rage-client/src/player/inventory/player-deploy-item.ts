import { register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { waitForObjectToLoad } from '../../util/object.util';
import { onMouseClick } from '../../util/click.util';

type DeployResult = [Vector3, Vector3] | undefined;

const ROTATION_STEP = 15;
const DEPLOY_DISTANCE = 1.2;

let object: ObjectMp | null = null;
let activeDeploy:
  | {
  model: string;
  resolve: (data: DeployResult) => void;
  rotationZ: number;
}
  | null = null;

function updatePlacement() {
  if (!activeDeploy || !object || !mp.objects.exists(object)) return;

  const player = mp.players.local;
  const forward = player.getForwardVector();

  const x = player.position.x + forward.x * DEPLOY_DISTANCE;
  const y = player.position.y + forward.y * DEPLOY_DISTANCE;


  // ROTATION INPUT (mouse wheel)
  if (
    mp.game.controls.isDisabledControlPressed(
      RageEnums.InputGroup.INPUTGROUP_MOVE,
      RageEnums.Controls.INPUT_WEAPON_WHEEL_PREV
    )
  ) {
    activeDeploy.rotationZ -= ROTATION_STEP;
  }

  if (
    mp.game.controls.isDisabledControlPressed(
      RageEnums.InputGroup.INPUTGROUP_MOVE,
      RageEnums.Controls.INPUT_WEAPON_WHEEL_NEXT
    )
  ) {
    activeDeploy.rotationZ += ROTATION_STEP;
  }

  // normalize
  if (activeDeploy.rotationZ >= 360) activeDeploy.rotationZ -= 360;
  if (activeDeploy.rotationZ < 0) activeDeploy.rotationZ += 360;

  object.setCoordsNoOffset(x, y, mp.players.local.position.z, true, true, true);
  object.setRotation(0, 0, activeDeploy.rotationZ, 2, true);
  object.placeOnGroundProperly();
}


async function deployItemHandler(model: string): Promise<DeployResult> {
  if (activeDeploy) return undefined;

  activeDeploy = {
    model,
    resolve: () => {},
    rotationZ: mp.players.local.getRotation(2).z
  };

  object = mp.objects.new(mp.game.joaat(model), mp.players.local.position, {
    dimension: mp.players.local.dimension
  });

  await waitForObjectToLoad(object);

  object.setCollision(false, true);
  object.setAlpha(175);

  mp.events.add('render', updatePlacement);

  return new Promise(resolve => {
    if (!activeDeploy) return resolve(undefined);

    activeDeploy.resolve = resolve;

    onMouseClick('left', 'down', () => {
      if (!activeDeploy || !object || !mp.objects.exists(object)) return;

      const result: DeployResult = [
        object.getCoords(false),
        object.getRotation(2)
      ];

      resolve(result);
      cancelDeployItemHandler();
    }, true);
  });
}

function cancelDeployItemHandler() {
  mp.events.remove('render', updatePlacement);

  if (object && mp.objects.exists(object)) {
    object.destroy();
  }

  object = null;

  if (activeDeploy) {
    activeDeploy.resolve(undefined);
    activeDeploy = null;
  }
}


register(ProcedureKey.CLIENT_PLAYER_DEPLOY_ITEM, deployItemHandler);
register(ProcedureKey.CLIENT_PLAYER_DEPLOY_ITEM_CANCEL, cancelDeployItemHandler);
