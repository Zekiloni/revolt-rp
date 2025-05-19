import { PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { register } from '@libertymp/rage-rpc';

const MAX_DISTANCE = 3;

function getCameraDirection() {
  const rot = mp.game.cam.getGameplayRot(2);
  const pitch = rot.x * Math.PI / 180.0;
  const yaw = rot.z * Math.PI / 180.0;

  const x = -Math.sin(yaw) * Math.cos(pitch);
  const y = Math.cos(yaw) * Math.cos(pitch);
  const z = Math.sin(pitch);

  return new mp.Vector3(x, y, z);
}


function getLookingAtHit(maxDistance = 100.0) {
  const cameraPos = mp.cameras.gameplay.getCoord();
  const direction = getCameraDirection();

  const targetPos = new mp.Vector3(
    cameraPos.x + direction.x * maxDistance,
    cameraPos.y + direction.y * maxDistance,
    cameraPos.z + direction.z * maxDistance
  );

  mp.game.graphics.drawLine(cameraPos.x, cameraPos.y, cameraPos.z, targetPos.x, targetPos.y, targetPos.z, 255, 0, 0, 255);
  return mp.raycasting.testPointToPointAsync(cameraPos, targetPos, mp.players.local.handle, 4);
}


async function highlightLookingAtPlayer() {
  const hit = await getLookingAtHit(MAX_DISTANCE);

  if (hit && typeof hit.entity === 'object') {
    const player = hit.entity as PlayerMp;
    if (player.type !== RageEnums.EntityType.PLAYER || !player?.position) return;
    mp.game.graphics.drawMarker(
      0,
      player.position.x,
      player.position.y,
      player.position.z + 0.8,
      0,
      0,
      0,
      0,
      0,
      0,
      0.3,
      0.3,
      0.3,
      255,
      255,
      255,
      255,
      false,
      false,
      2,
      false,
      null,
      null,
      false
    );
  }
}

function playerHighlightDataHandler(target: PlayerMp, value: boolean, oldValue?: boolean) {
  if (target.type !== RageEnums.EntityType.PLAYER) {
    return;
  }

  if (target.handle === mp.players.local.handle) {
    if (value) {
      mp.events.add('render', highlightLookingAtPlayer);
    } else {
      mp.events.remove('render', highlightLookingAtPlayer);
    }
  }
}

mp.events.addDataHandler(PlayerSharedDataType.HighlightTarget, playerHighlightDataHandler);

register(ProcedureKey.CLIENT_GET_HIGHLIGHT_TARGET, async () => {
  const target = await getLookingAtHit(MAX_DISTANCE);
  mp.gui.chat.push(`CLIENT_GET_HIGHLIGHT_TARGET: ${JSON.stringify(target)}`);
  return target ? target.entity : null;
});

//
// mp.keys.bind(0x73, true, () => {
//   mp.peds.new(mp.game.joaat("a_m_m_business_01"), mp.players.local.position, 0);
// });
//
// mp.events.add("render", () => {
//   if (mp.keys.isDown(0x71)) {
//     const start = mp.players.local.position;
//     const direction = mp.game.cam.getGameplayRot(2);
//
//     function conv(v: Vector3) {
//       const z = (v.z * Math.PI) / 180.0;
//       const x = (v.x * Math.PI) / 180.0;
//       const num = Math.abs(Math.cos(x));
//
//       return {
//         x: -Math.sin(z) * num,
//         y: Math.cos(z) * num,
//         z: Math.sin(x),
//       };
//     }
//
//     const dir = conv(direction);
//     const dist = 3;
//     const end = new mp.Vector3(
//       start.x + dir.x * dist,
//       start.y + dir.y * dist,
//       start.z + dir.z * dist,
//     );
//     const ray = mp.raycasting.testPointToPoint(start, end, [1, 2]);
//     if (ray) {
//       const ent = ray.entity as EntityMp;
//       if (ent.type !== "ped" || !ent?.position) return;
//       mp.game.graphics.drawMarker(
//         0,
//         ent.position.x,
//         ent.position.y,
//         ent.position.z + 1.5,
//         0,
//         0,
//         0,
//         0,
//         0,
//         0,
//         0.3,
//         0.3,
//         0.3,
//         255,
//         255,
//         255,
//         255,
//         false,
//         false,
//         2,
//         false,
//         null,
//         null,
//         false,
//       );
//     }
//   }
// });
