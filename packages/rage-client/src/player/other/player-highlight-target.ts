import { PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { register } from '@libertymp/rage-rpc';

const MAX_DISTANCE = 3;

function getCameraDirection() {
  const rot = mp.cameras.gameplay.getRot(2); // Returns Vector3 (pitch, roll, yaw)
  const pitch = rot.x * Math.PI / 180.0;
  const yaw = rot.z * Math.PI / 180.0;

  const x = -Math.sin(yaw) * Math.cos(pitch);
  const y = Math.cos(yaw) * Math.cos(pitch);
  const z = Math.sin(pitch);

  return new mp.Vector3(x, y, z);
}


function getCameraForwardHit(maxDistance = 100.0) {
  const cameraPos = mp.cameras.gameplay.getCoord();
  const direction = getCameraDirection();

  const targetPos = new mp.Vector3(
    cameraPos.x + direction.x * maxDistance,
    cameraPos.y + direction.y * maxDistance,
    cameraPos.z + direction.z * maxDistance
  );

  mp.game.graphics.drawLine(cameraPos.x, cameraPos.y, cameraPos.z, targetPos.x, targetPos.y, targetPos.z, 255, 0, 0, 255);
  return mp.raycasting.testPointToPointAsync(cameraPos, targetPos, mp.players.local.handle, 4); // 1 = intersect everything
}


async function highlightTargetPlayer() {
  const hit = await getCameraForwardHit(MAX_DISTANCE);

  if (hit) {
    mp.gui.chat.push(`Hit: ${JSON.stringify(hit)}}`);
  }
}

function playerHighlightDataHandler(target: PlayerMp, value: boolean, oldValue?: boolean) {
  if (target.type !== RageEnums.EntityType.PLAYER) {
    return;
  }

  if (target.handle === mp.players.local.handle) {
    if (value) {
      mp.events.add('render', highlightTargetPlayer);
    } else {
      mp.events.remove('render', highlightTargetPlayer);
    }
  }
}

mp.events.addDataHandler(PlayerSharedDataType.HighlightTarget, playerHighlightDataHandler);

register(ProcedureKey.CLIENT_GET_HIGHLIGHT_TARGET, async () => {
  const target = await getCameraForwardHit(MAX_DISTANCE);
  if (target) {
    return target.entity;
  }
});
