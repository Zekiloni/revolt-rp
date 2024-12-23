
export async function teleportPlayerToWaypoint() {
  const waypoint = mp.game.ui.getFirstBlipInfoId(8);
  if (!mp.game.ui.doesBlipExist(waypoint)) return;

  const waypointPos = mp.game.ui.getBlipInfoIdCoord(waypoint);
  if (!waypointPos) return;

  let zCoord = mp.game.gameplay.getGroundZFor3dCoord(
    waypointPos.x,
    waypointPos.y,
    waypointPos.z,
    false,
    false
  );

  if (!zCoord) {
    for (let i = 1000; i >= 0; i -= 25) {
      mp.game.streaming.requestCollisionAtCoord(waypointPos.x, waypointPos.y, i);
      await mp.game.waitAsync(0);
    }

    zCoord = mp.game.gameplay.getGroundZFor3dCoord(waypointPos.x, waypointPos.y, 1000, false, false);
    if (!zCoord)  return;
  }

  mp.players.local.position = new mp.Vector3(
    waypointPos.x,
    waypointPos.y,
    zCoord + 0.5
  );
}
