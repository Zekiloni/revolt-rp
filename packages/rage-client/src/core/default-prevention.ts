const IDLE_CAMERA_TIME = 28 * 1000;

const weaponKnockControls = [
  140,
  141,
  142,
  263,
  264
];

mp.game.audio.setFlag('DisableFlightMusic', true);
mp.game.audio.setAudioFlag('DisableFlightMusic', true);

function defaultGamePrevents() {
  // Disabling melee attack with weapon
  if (mp.players.local.weapon != RageEnums.Weapons.Hash.UNARMED) {
    for (const control of weaponKnockControls) {
      mp.game.controls.disableControlAction(0, control, true);
    }
  }

  // Disabling Idling camera
  mp.game.invoke(RageEnums.Natives.CAM._INVALIDATE_VEHICLE_IDLE_CAM);
  mp.game.invoke(RageEnums.Natives.CAM.INVALIDATE_IDLE_CAM);

  // Disabling weapon wheeel
  mp.game.controls.disableControlAction(RageEnums.InputGroup.INPUTGROUP_WEAPON_WHEEL_CYCLE, RageEnums.Controls.INPUT_SELECT_WEAPON, true);

  if (mp.game.cam.isCinematicActive()) {
    mp.game.cam.setCinematicModeActive(false);
  }
  // Disabling props from falling / TODO
  // mp.game.invoke(RageEnums.Natives.PED.SET_PED_CAN_LOSE_PROPS_ON_DAMAGE, mp.players.local.handle ,false, 0);
  // mp.players.forEachInRange(mp.players.local.position, 75,
  //    (_target) => {
  //       mp.game.invoke(RageEnums.Natives.PED.SET_PED_CAN_LOSE_PROPS_ON_DAMAGE, _target.handle, false, 0);
  //    }
  // );
}

function invalidateGameplayIdleCamera() {
  mp.game.cam.invalidateIdle();

  if (mp.players.local.vehicle) {
    mp.game.cam.invalidateVehicleIdle();
  }
}

mp.events.add({ render: defaultGamePrevents });
setInterval(invalidateGameplayIdleCamera, IDLE_CAMERA_TIME);
