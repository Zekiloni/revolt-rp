import { register } from '@libertymp/rage-rpc';
import { PlayerSharedDataType, ProcedureKey, rgbColors } from '@revolt-rp/common';

const MAX_DISTANCE = 3;


function getLookingAtPoint(distance: number) {
  const start = mp.players.local.position;
  const direction = mp.game.cam.getGameplayRot(2);

  function conv(v: Vector3) {
    const z = (v.z * Math.PI) / 180.0;
    const x = (v.x * Math.PI) / 180.0;
    const num = Math.abs(Math.cos(x));

    return {
      x: -Math.sin(z) * num,
      y: Math.cos(z) * num,
      z: Math.sin(x)
    };
  }

  const dir = conv(direction);
  const end = new mp.Vector3(
    start.x + dir.x * distance,
    start.y + dir.y * distance,
    start.z + dir.z * distance
  );

  return { start, end };
}

function getLookingAtHit(distance = 100.0) {
  const { start, end } = getLookingAtPoint(distance);
  return mp.raycasting.testPointToPoint(start, end, mp.players.local.handle, 4);
}

function getLookingAtHitAsync(distance = 100.0) {
  const { start, end } = getLookingAtPoint(distance);
  return mp.raycasting.testPointToPointAsync(start, end, mp.players.local.handle, 4);
}


async function highlightLookingAtPlayer() {
  const hit = getLookingAtHit(MAX_DISTANCE);

  if (hit && typeof hit.entity === 'object') {
    const player = hit.entity as PlayerMp;
    if (player.type !== RageEnums.EntityType.PLAYER || !player?.position) return;

    const [r, g, b] = rgbColors.SUN_GLOW_GECKO;

    mp.game.graphics.drawMarker(
      0,
      player.position.x,
      player.position.y,
      player.position.z + 1.3,
      0,
      0,
      0,
      0,
      0,
      0,
      0.3,
      0.3,
      0.3,
      r,
      g,
      b,
      225,
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
  const target = await getLookingAtHitAsync(MAX_DISTANCE);
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
