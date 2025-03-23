const roadBuffers = {
  currentBuffer: 0,
  zoneBuffers: [-1, -1, -1, -1],
  lastKnownSpeed: -1,
  lastKnownZone: -1
};

function getRoadProperties(x: number, y: number, z: number, density: number, flags: number) {
  roadBuffers.currentBuffer++;
  if (roadBuffers.currentBuffer > 4) {
    roadBuffers.currentBuffer = 1;
  }


  const result = mp.game.pathfind.getVehicleNodeProperties(x, y, z);
  const zoneFlags = result.flags;

  const isOnRoad = mp.game.pathfind.isPointOnRoad(x, y, z, 0);

  roadBuffers.zoneBuffers[roadBuffers.currentBuffer - 1] = zoneFlags;

  if (roadBuffers.zoneBuffers[0] === roadBuffers.zoneBuffers[1] &&
    roadBuffers.zoneBuffers[0] === roadBuffers.zoneBuffers[2] &&
    roadBuffers.zoneBuffers[0] === roadBuffers.zoneBuffers[3]) {

    const ZT = roadBuffers.zoneBuffers[0];
    roadBuffers.lastKnownZone = ZT;
    let curDetectedAllowedSpeed = -1;

    if (ZT === 10 || ZT === 14) {
      curDetectedAllowedSpeed = 15;
    }

    if ((ZT === 2 || ZT === 3 || ZT === 6 || ZT === 11 || ZT === 13) ||
      (ZT >= 34 && ZT < 48)) {
      curDetectedAllowedSpeed = 50;
    }

    if (ZT === 66 || ZT === 82) {
      curDetectedAllowedSpeed = 120;
    }

    if (curDetectedAllowedSpeed > -1) {
      roadBuffers.lastKnownSpeed = curDetectedAllowedSpeed;
    }
  }

  return {
    speedLimit: roadBuffers.lastKnownSpeed,
    isOnRoad: isOnRoad,
    zoneFlag: roadBuffers.lastKnownZone
  };
}
