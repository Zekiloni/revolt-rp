const roadBuffers = {
  currentBuffer: 0,
  zoneBuffers: [-1, -1, -1, -1],
  lastKnownSpeed: -1,
  lastKnownZone: -1
};


/**
 * 2:
 *
 * mainly “50kMh City Roads”
 * 3:
 *
 * Road around/connecting to TLAD Trailer park and almost all the way along
 * Alamo Sea. So I’m considering to treat it as 2 in regards to “zone speeds”
 * 6:
 *
 * Roads around/near LS Airport
 * LOTS of roads in Vinewood hills report 6 (including many small driveways there)
 * Parkinglot right across LS airport terminal (right side)
 * Some roads of Paleto Bay report 6 (although most report 2, except the ‘road passing by’ which
 * identifies as a ‘freeway’ (66))
 * Part of LS reports 6 (around Arcadius Business Center for example)
 * 10:
 *
 * Many parking and driveways lots
 * Gas stations
 * LS Airport itself
 * (sand) roads around Davis Quartz
 * Roads at the PalmerTylor Green Power Station
 * (Funny thing is that there is also text on the road saying 10!)
 * The Lost And Damned ‘Trailer Park’
 * Nearly entire coastline/beach along Del Perro
 * Some sections of Mount Chiliad/Raton Canyon
 * NOTE: Some highway exits also briefly report 10!
 * 11:
 *
 * So far only sand roads
 * Sand road/part at Sandy Shores Airport
 * Runway part of McKenzie airfield (sand part around it reports flag 10)
 * Some sections of Mount Chiliad/Raton Canyon
 * Beach/Coastal line a little further from Paleto Bay
 * 13:
 *
 * Part of mountains around Zancudo
 * 14:
 *
 * Parking lot LS Airport
 * Parking lot near Del Perro Pierre
 * Begin of LS Airport itself (near Devin Weston)
 * Parking GARAGE LS Airport
 * Some sections of Mount Chiliad/Raton Canyon (sand roads)
 * 15:
 *
 * The ‘Tarmac’ part of Sandy Shores Airport (the runways themselves!)
 * NOTE: MOST LIKELY not the only location/zone which report 15 so DO NOT
 * use this as identifier to ‘recognize’ this airport location!!!
 * 18:
 * Is being reported inside the ‘tunnel’ (normal road tunnel!) near Pillbox
 *
 * 34:
 *
 * First part (until near the bridge which goes left) of the road to Catfish View.
 * Starts Right at the sign which says Cape Catfish
 * Part of the sand/dirt road between Paleto Bay and the coastal line (up to the stunt jump,
 * then it changes into 42 for a while, ending in flag 11 for the last part!)
 * NOTE: The part with 42 also seems to have random cars spawning (driving around)
 * 35:
 *
 * Road leading up to Tataviam Mountains
 * Road leading up to Catfish View (Dead-end road resulting in a ‘u turn’!)
 * (The TARMAC PART of this road!, the last section of this road returns 47!)
 * 38:
 *
 * Road up to radio station behind Vinewood sign (Mt. Haan Dr.)
 * 40:
 *
 * Large portion of Mount Gordo reports flag 40
 * 42:
 *
 * Entry road up to Zancudo
 * One parking lot near LS Airport (with the yellow Rental buses on it)
 * Some Sand Roads leading from Sandy Shores to Grand Senora Desert
 * (sand) roads at the ‘inner circles’ of Davis Quartz
 * Some Caravan/Trailer parks around Sandy Shores (with sand roads)
 * Road up to lighthouse at Mount Gordo
 * Some Parking lot’s
 * Many of the smaller roads in Vespucci Canals report 42
 * 43:
 *
 * Sand Roads at alien worship location (Sandy Shores)
 * SAND part road at the middle of Tataviam Mountains (near the dam!)
 * Beach next to Paleto Bay
 * 46:
 *
 * Parking lot right across LS airport terminal (left side)
 * 47:
 *
 * Some (off road?) bicycle tracks/courses
 * The last part of the road at Catfish view)
 * 64:
 *
 * Freeway Connection/Splits (the “driving over the lines” part?)
 * Some parts of mountains also report 64 (around Zancudo some mountain parts for example)
 * 66 = Mainly (if not only!) Freeway
 * 82 = Freeway Tunnels, due to some of the tunnels also being interiors I suppose they need a different flag than 66 for some reason.
 * @param x
 * @param y
 * @param z
 */

export function getRoadProperties(x: number, y: number, z: number) {
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
