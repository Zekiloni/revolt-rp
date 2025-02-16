import { getCrossProduct, getNormalizedVector } from '../../util/vector.util';
import { on } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';

let isNoClipActive = false;
let camera: CameraMp | null;
let shiftModifier = false;
let controlModifier = false;

const bindASCIIKeys = {
  Q: 69,
  E: 81,
  LCtrl: 17,
  Shift: 16
};


function toggleNoClip() {
  isNoClipActive = !isNoClipActive;
  mp.game.ui.displayRadar(!isNoClipActive);

  if (isNoClipActive) {
    const { position } = mp.players.local;

    const cameraPosition = new mp.Vector3(
      position.x,
      position.y,
      position.z
    );

    const cameraRotation = mp.game.cam.getGameplayCamRot(2);

    camera = mp.cameras.new('default', cameraPosition, cameraRotation, 45);

    camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
    mp.players.local.freezePosition(true);
    mp.players.local.setInvincible(true);
    mp.players.local.setVisible(false, false);
    mp.players.local.setCollision(false, false);

    mp.events.add('render', handleNoClip);
  } else {
    mp.events.remove('render', handleNoClip);

    if (camera) {
      mp.players.local.position = camera.getCoord();
      mp.players.local.setHeading(camera.getRot(2).z);
      camera.destroy(true);
      camera = null;
    }

    mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);
    mp.players.local.freezePosition(false);
    mp.players.local.setInvincible(false);
    mp.players.local.setVisible(true, false);
    mp.players.local.setCollision(true, false);
  }
}


function handleNoClip() {
  if (!camera || mp.gui.cursor.visible) {
    return;
  }

  controlModifier = mp.keys.isDown(bindASCIIKeys.LCtrl);
  shiftModifier = mp.keys.isDown(bindASCIIKeys.Shift);
  const rot = camera.getRot(2);
  let fastMult = 1;
  let slowMult = 1;

  if (shiftModifier) {
    fastMult = 3;
  } else if (controlModifier) {
    slowMult = 0.5;
  }

  const rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);
  const rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);
  const leftAxisX = mp.game.controls.getDisabledControlNormal(0, 218);
  const leftAxisY = mp.game.controls.getDisabledControlNormal(0, 219);

  const pos = camera.getCoord();
  const rr = camera.getDirection();
  const vector = new mp.Vector3(0, 0, 0);
  vector.x = rr.x * leftAxisY * fastMult * slowMult;
  vector.y = rr.y * leftAxisY * fastMult * slowMult;
  vector.z = rr.z * leftAxisY * fastMult * slowMult;
  const upVector = new mp.Vector3(0, 0, 1);

  const rightVector = getCrossProduct(
    getNormalizedVector(rr),
    getNormalizedVector(upVector)
  );

  rightVector.x *= leftAxisX * 0.5;
  rightVector.y *= leftAxisX * 0.5;
  rightVector.z *= leftAxisX * 0.5;
  let upMovement = 0.0;

  if (mp.keys.isDown(bindASCIIKeys.Q)) {
    upMovement = 0.5;
  }

  let downMovement = 0.0;
  if (mp.keys.isDown(bindASCIIKeys.E)) {
    downMovement = 0.5;
  }

  mp.players.local.position = new mp.Vector3(
    pos.x + vector.x + 1,
    pos.y + vector.y + 1,
    pos.z + vector.z + 1
  );

  mp.players.local.heading = rr.z;

  camera.setCoord(
    pos.x - vector.x + rightVector.x,
    pos.y - vector.y + rightVector.y,
    pos.z - vector.z + rightVector.z + upMovement - downMovement
  );

  camera.setRot(
    rot.x + rightAxisY * -5.0,
    0.0,
    rot.z + rightAxisX * -5.0,
    2
  );
}


on(ProcedureKey.CLIENT_PLAYER_TOGGLE_NO_CLIP, toggleNoClip);
